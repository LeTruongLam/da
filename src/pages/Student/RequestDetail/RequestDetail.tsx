import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Pagination,
  Button,
  message,
  Tabs,
  Form,
  Input,
  Upload,
  Modal,
  Typography,
  Avatar,
  Space,
  Alert,
  Empty,
  Spin,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CommentOutlined,
  UploadOutlined,
  MailOutlined,
  InboxOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { UploadProps } from "antd/es/upload/interface";
import { getRequestDetail } from "@/services/api/request";

// Custom interface definitions to replace those from api.ts
interface Document {
  id: string;
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Task {
  key: string;
  name: string;
  startDate: string;
  deadline: string;
  description: string;
  status: string;
  score?: number;
  feedback?: string;
}

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const PAGE_SIZE = 5;

interface SubmissionFormValues {
  taskId: string;
  taskName: string;
  note: string;
}

const RequestDetailPage = () => {
  const { id: request_id } = useParams();

  // States
  const [documentPage, setDocumentPage] = useState(1);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Forms
  const [submissionForm] = Form.useForm();

  // Fetch thesis details with mock data
  const { data: requestData, isLoading: requestLoading } = useQuery({
    queryKey: ["request-thesis", request_id],
    queryFn: async () => {
      if (!request_id) return null;

      const result = await getRequestDetail(Number(request_id));
      return result;
    },
    enabled: !!request_id,
  });

  // Fetch thesis documents with mock data
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["documents", request_id],
    queryFn: () => {
      if (!request_id) return [];

      // Replace API call with mock data
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

  // Pagination helper
  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Upload props for document submission
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://api.example.com/upload",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  // Document submission
  const handleSubmitTask = (values: SubmissionFormValues) => {
    console.log("Task submission:", values);
    message.success("Nộp bài tập thành công!");
    setIsSubmissionModalVisible(false);
    submissionForm.resetFields();
  };

  // Show submission modal for a specific task
  const showSubmissionModal = (task: Task) => {
    setSelectedTask(task);
    submissionForm.setFieldsValue({
      taskId: task.key,
      taskName: task.name,
    });
    setIsSubmissionModalVisible(true);
  };

  interface StatusColorsType {
    [key: string]: string;
  }

  interface StatusTextType {
    [key: string]: string;
  }

  const statusColors: StatusColorsType = {
    not_started: "default",
    in_progress: "processing",
    completed: "success",
    late: "error",
    upcoming: "blue",
    pending: "orange",
    approved: "cyan",
    rejected: "red",
  };

  const getTaskStatusTag = (status: string) => {
    const statusText: StatusTextType = {
      not_started: "Chưa bắt đầu",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành",
      late: "Trễ hạn",
      upcoming: "Sắp tới",
      pending: "Chờ xác nhận",
      approved: "Đã xác nhận",
      rejected: "Từ chối",
    };

    return <Tag color={statusColors[status]}>{statusText[status]}</Tag>;
  };

  if (requestLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải thông tin đồ án..." />
      </div>
    );
  }

  // if (!) {
  //   return (
  //     <Empty
  //       description="Không tìm thấy thông tin đồ án"
  //       image={Empty.PRESENTED_IMAGE_SIMPLE}
  //     />
  //   );
  // }

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
            {/* <Col>
              <Tag color={thesis.status === "in_progress" ? "blue" : "green"}>
                {thesis.status === "in_progress"
                  ? "Đang thực hiện"
                  : "Hoàn thành"}
              </Tag>
            </Col> */}
          </Row>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tổng quan" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Card title="Thông tin đồ án">
                  <Paragraph>
                    <Text strong>Mô tả: </Text>
                    {/* {requestData?.thesis. || "--"} */}
                  </Paragraph>
                  {/* <Paragraph>
                    <Text strong>Tiến độ tổng thể: </Text>
                  </Paragraph>
                  <Progress
                    percent={progress}
                    status={progress === 100 ? "success" : "active"}
                  /> */}
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card title="Giảng viên hướng dẫn">
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                      {requestData?.lecturer.name || "--"}
                    </Title>
                  </div>

                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Paragraph>
                      <MailOutlined style={{ marginRight: 8 }} />
                      {requestData?.lecturer.email || "--"}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Nhiệm vụ (Tasks)" key="tasks">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Danh sách công việc">
                  {requestData?.tasks ? (
                    <Table
                      dataSource={requestData?.tasks || []}
                      rowKey="key"
                      columns={[
                        {
                          title: "Tên công việc",
                          dataIndex: "task_name",
                          key: "task_name",
                          render: (text) => (
                            <Space>
                              <FileTextOutlined />
                              <Text strong>{text}</Text>
                            </Space>
                          ),
                        },
                        {
                          title: "Deadline",
                          dataIndex: "due_date",
                          key: "due_date",
                        },
                        {
                          title: "Trạng thái",
                          dataIndex: "status",
                          key: "status",
                          render: (status) => getTaskStatusTag(status),
                        },
                        {
                          title: "Thao tác",
                          key: "action",
                          render: (_, record: Task) => (
                            <Space>
                              {record.status !== "completed" && (
                                <Button
                                  type="primary"
                                  icon={<UploadOutlined />}
                                  onClick={() => showSubmissionModal(record)}
                                >
                                  Nộp bài
                                </Button>
                              )}
                              {record.feedback && (
                                <Button
                                  type="link"
                                  icon={<CommentOutlined />}
                                  onClick={() => message.info(record.feedback)}
                                >
                                  Nhận xét
                                </Button>
                              )}
                            </Space>
                          ),
                        },
                      ]}
                    />
                  ) : (
                    <Empty description="Chưa có nhiệm vụ nào được giao" />
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Tài liệu" key="documents">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card
                  title="Tài liệu tham khảo"
                >
                  {documentsLoading ? (
                    <Spin tip="Đang tải dữ liệu..." />
                  ) : documents.length > 0 ? (
                    <>
                      <Table
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
                            title: "Ngày tải lên",
                            dataIndex: "uploadedAt",
                            key: "uploadedAt",
                          },
                          {
                            title: "Thao tác",
                            key: "action",
                            render: () => (
                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  message.info("Chức năng xóa đang cập nhật")
                                }
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
                          onChange={setDocumentPage}
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
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal nộp bài tập */}
      <Modal
        title={
          selectedTask ? `Nộp bài: ${selectedTask.name}` : "Nộp tài liệu mới"
        }
        open={isSubmissionModalVisible}
        onCancel={() => setIsSubmissionModalVisible(false)}
        footer={null}
      >
        <Form
          form={submissionForm}
          layout="vertical"
          onFinish={handleSubmitTask}
        >
          {selectedTask && (
            <>
              <Form.Item name="taskId" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="taskName" hidden>
                <Input />
              </Form.Item>
              <Alert
                message={`Deadline: ${selectedTask.deadline}`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </>
          )}

          <Form.Item name="note" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Ghi chú về tài liệu hoặc bài nộp (không bắt buộc)..."
            />
          </Form.Item>

          <Form.Item
            name="file"
            label="Tải lên file"
            rules={[{ required: true, message: "Vui lòng tải lên file!" }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click hoặc kéo thả file vào khu vực này
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ các định dạng: PDF, DOC, DOCX, PPT, ZIP...
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Nộp bài
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RequestDetailPage;
