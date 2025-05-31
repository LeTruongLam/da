import { Card, Row, Col, Tabs, Spin } from "antd";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  ThesisHeader,
  StudentCard,
  TasksTable,
  DocumentsTable,
  StudentEvaluation,
} from "./components";

// Import types separately with type keyword
import { getRequestDetail } from "@/services/api/request";

const { TabPane } = Tabs;
const PAGE_SIZE = 5;

// Extend SubTask to include feedback and score which are needed

const RequestDetailPage = () => {
  const { id: requestId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "evaluate" ? "2" : "1";

  const [documentPage, setDocumentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);

  const [documentsLoading, setDocumentsLoading] = useState(false);

  const {
    data: requestDetailData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["request-detail", requestId],
    queryFn: () => getRequestDetail(requestId as unknown as number),
  });

  // Add functions to use the loading states
  const loadDocuments = () => {
    setDocumentsLoading(true);
    // Simulate API call to load documents
    setTimeout(() => {
      setDocumentsLoading(false);
    }, 800);
  };

  // Use these functions in useEffect to load data when component mounts
  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Card title="Chi tiết đề tài" style={{ margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <ThesisHeader requestData={requestDetailData} />
          </Col>

          <Col span={24}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Tổng quan" key="1">
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <StudentCard student={requestDetailData?.student} />
                  </Col>

                  <Col span={24}>
                    <TasksTable
                      requestData={requestDetailData}
                      refetch={refetch}
                    />
                  </Col>

                  <Col span={24}>
                    <DocumentsTable
                      thesisId={requestDetailData?.thesis.thesis_id}
                    />
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Đánh giá sinh viên" key="2">
                <StudentEvaluation
                  refetch={refetch}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};

export default RequestDetailPage;
