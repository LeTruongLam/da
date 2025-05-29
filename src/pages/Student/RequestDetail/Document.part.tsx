import type { RequestDetailResponse } from "@/services/api/request";
import { FileTextOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Pagination, Row, Spin, Table } from "antd";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Document = {
  id: string;
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
};

type OverviewPartProps = {
  requestData: RequestDetailResponse | undefined | null;
};

const PAGE_SIZE = 5;

const paged = (data: Document[], page: number) => {
  const start = (page - 1) * PAGE_SIZE;
  return data.slice(start, start + PAGE_SIZE);
};

const DocumentPartComponent: React.FC<OverviewPartProps> = ({
  requestData,
}) => {
  const [documentPage, setDocumentPage] = useState(1);
  const request_id = requestData?.id;

  const { data: documents = [], isLoading: documentsLoading } = useQuery<
    Document[]
  >({
    queryKey: ["documents", request_id],
    queryFn: () => {
      if (!request_id) return Promise.resolve([]);
      // Giả lập gọi API
      return Promise.resolve<Document[]>([
        {
          id: "1",
          name: "Đề cương đồ án.pdf",
          fileUrl: "#",
          uploadedBy: "Nguyễn Văn A",
          uploadedAt: "2024-06-12",
        },
        {
          id: "2",
          name: "Báo cáo chương 1.docx",
          fileUrl: "#",
          uploadedBy: "Nguyễn Văn A",
          uploadedAt: "2024-06-29",
        },
      ]);
    },
    enabled: !!request_id,
  });

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card title="Tài liệu tham khảo">
          {documentsLoading ? (
            <Spin tip="Đang tải dữ liệu..." />
          ) : documents.length > 0 ? (
            <>
              <Table
                rowKey="id"
                columns={[
                  {
                    title: "Tên file",
                    dataIndex: "name",
                    key: "name",
                    render: (name, record: Document) => (
                      <a
                        href={record.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileTextOutlined /> {name}
                      </a>
                    ),
                  },
                  {
                    title: "Người tải lên",
                    dataIndex: "uploadedBy",
                    key: "uploadedBy",
                  },
                  {
                    title: "Ngày tải lên",
                    dataIndex: "uploadedAt",
                    key: "uploadedAt",
                  },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: (_, record: Document) => (
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          window.open(record.fileUrl, "_blank");
                        }}
                      >
                        Tải về
                      </Button>
                    ),
                  },
                ]}
                dataSource={paged(documents, documentPage)}
                pagination={false}
              />
              {documents.length > PAGE_SIZE && (
                <Pagination
                  current={documentPage}
                  pageSize={PAGE_SIZE}
                  total={documents.length}
                  onChange={(page) => setDocumentPage(page)}
                  style={{ marginTop: 16, textAlign: "right" }}
                />
              )}
            </>
          ) : (
            <Empty description="Chưa có tài liệu nào được tải lên" />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default DocumentPartComponent;
