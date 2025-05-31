import { Card, Row, Col, Tabs, Typography, Empty, Spin } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRequestDetail } from "@/services/api/request";
import OverviewPartComponent from "./Overview.part";
import TaskPartComponent from "./Task.part";
import DocumentPartComponent from "./Document.part";

const { TabPane } = Tabs;
const { Title } = Typography;

const RequestDetailPage = () => {
  const { id: request_id } = useParams();

  // States
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch thesis details with mock data
  const {
    data: requestData,
    isLoading: requestLoading,
    refetch,
  } = useQuery({
    queryKey: ["request-thesis", request_id],
    queryFn: async () => {
      if (!request_id) return null;

      const result = await getRequestDetail(Number(request_id));
      return result;
    },
    enabled: !!request_id,
  });

  useEffect(() => {
    if (activeTab !== "document") {
      refetch();
    }
  }, [activeTab, refetch]);

  if (requestLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải thông tin đồ án..." />
      </div>
    );
  }

  if (!requestData) {
    return (
      <Empty
        description="Không tìm thấy thông tin đồ án"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
      <Card
        title={
          <Row align="middle" gutter={16}>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                <FileTextOutlined /> {requestData?.thesis.title || "--"}
              </Title>
            </Col>
          </Row>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tổng quan" key="overview">
            <OverviewPartComponent requestData={requestData} />
          </TabPane>

          <TabPane tab="Nhiệm vụ (Tasks)" key="tasks">
            <TaskPartComponent requestData={requestData} refetch={refetch} />
          </TabPane>

          <TabPane tab="Tài liệu" key="documents">
            <DocumentPartComponent thesisId={requestData.thesis.thesis_id} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RequestDetailPage;
