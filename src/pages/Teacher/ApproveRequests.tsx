import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  message,
  Descriptions,
  Typography,
  Avatar,
  Divider,
  Modal,
  Form,
  Input,
  Tabs,
  Alert,
} from "antd";
import { useState } from "react";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Interfaces for type safety
interface StudentProfile {
  major: string;
  gpa: number;
  achievements: string;
  skills: string[];
}

interface RequestData {
  id: string;
  studentId: string;
  studentName: string;
  thesisId: string;
  thesisTitle: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  studentProfile: StudentProfile;
  contactInfo: string;
  feedback?: string;
}

// Mock dữ liệu sinh viên đăng ký
const mockRequests: RequestData[] = [
  {
    id: "1",
    studentId: "20020001",
    studentName: "Nguyễn Văn A",
    thesisId: "T001",
    thesisTitle: "Ứng dụng AI trong giáo dục",
    requestDate: "2024-06-15",
    status: "pending",
    description:
      "Em mong muốn được làm đề tài này vì phù hợp với định hướng nghiên cứu và sở thích của em.",
    studentProfile: {
      major: "Công nghệ thông tin",
      gpa: 3.5,
      achievements: "Giải nhì cuộc thi lập trình sinh viên cấp trường năm 2023",
      skills: ["Java", "Python", "Machine Learning", "React"],
    },
    contactInfo: "nguyenvana@example.com | 0987654321",
  },
  {
    id: "2",
    studentId: "20020002",
    studentName: "Trần Thị B",
    thesisId: "T002",
    thesisTitle: "Phát triển ứng dụng web với React và Node.js",
    requestDate: "2024-06-16",
    status: "approved",
    description:
      "Em có kinh nghiệm với React và Node.js, mong muốn được phát triển sâu hơn trong lĩnh vực này.",
    studentProfile: {
      major: "Kỹ thuật phần mềm",
      gpa: 3.2,
      achievements: "Thực tập tại công ty ABC về lập trình web",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    },
    contactInfo: "tranthib@example.com | 0987654322",
  },
  {
    id: "3",
    studentId: "20020003",
    studentName: "Lê Văn C",
    thesisId: "T003",
    thesisTitle: "IoT trong nông nghiệp thông minh",
    requestDate: "2024-06-17",
    status: "rejected",
    description:
      "Em có sự quan tâm đến IoT và muốn ứng dụng vào lĩnh vực nông nghiệp.",
    studentProfile: {
      major: "Hệ thống thông tin",
      gpa: 3.0,
      achievements: "Đã từng làm dự án về cảm biến IoT",
      skills: ["IoT", "Arduino", "Embedded Systems", "C++"],
    },
    contactInfo: "levanc@example.com | 0987654323",
  },
  {
    id: "4",
    studentId: "20020004",
    studentName: "Phạm Thị D",
    thesisId: "T001",
    thesisTitle: "Ứng dụng AI trong giáo dục",
    requestDate: "2024-06-18",
    status: "pending",
    description:
      "Em đã có kinh nghiệm với các dự án AI và muốn áp dụng vào lĩnh vực giáo dục.",
    studentProfile: {
      major: "Khoa học máy tính",
      gpa: 3.7,
      achievements:
        "Nghiên cứu về Computer Vision, đã có 1 paper được đăng tạp chí trong nước",
      skills: ["Python", "TensorFlow", "Computer Vision", "NLP"],
    },
    contactInfo: "phamthid@example.com | 0987654324",
  },
];

// Màu sắc theo trạng thái
const statusColors = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

const statusText = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

interface FeedbackFormValues {
  feedback: string;
}

const ApproveRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedbackForm] = Form.useForm<FeedbackFormValues>();
  const [requests, setRequests] = useState(mockRequests);
  const [activeTab, setActiveTab] = useState("1");

  const showRequestDetail = (request: RequestData) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
    );
    message.success("Đã duyệt yêu cầu đăng ký thành công!");
    setIsModalVisible(false);
  };

  const handleReject = (values: FeedbackFormValues) => {
    if (selectedRequest) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "rejected", feedback: values.feedback }
            : req
        )
      );
      message.success("Đã từ chối yêu cầu đăng ký!");
      setIsModalVisible(false);
      feedbackForm.resetFields();
      setActiveTab("1");
    }
  };

  // Lọc các request theo trạng thái
  const pendingRequests = requests.filter((req) => req.status === "pending");
  const processedRequests = requests.filter((req) => req.status !== "pending");

  const columns = [
    {
      title: "Họ tên SV",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Đề tài",
      dataIndex: "thesisTitle",
      key: "thesisTitle",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "requestDate",
      key: "requestDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: RequestData) => (
        <Space>
          <Button type="link" onClick={() => showRequestDetail(record)}>
            Xem chi tiết
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="link"
                style={{ color: "green" }}
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  showRequestDetail(record);
                  setActiveTab("2");
                }}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý yêu cầu đăng ký đề tài">
      <Tabs defaultActiveKey="1">
        <TabPane tab={`Chờ duyệt (${pendingRequests.length})`} key="1">
          <Table
            columns={columns}
            dataSource={pendingRequests}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
        <TabPane tab={`Đã xử lý (${processedRequests.length})`} key="2">
          <Table
            columns={columns}
            dataSource={processedRequests}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={`Chi tiết yêu cầu đăng ký - ${
          selectedRequest?.studentName || ""
        }`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setActiveTab("1");
          feedbackForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        {selectedRequest && (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thông tin sinh viên" key="1">
              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <Title level={4} style={{ marginTop: 8 }}>
                  {selectedRequest.studentName}
                </Title>
                <Text type="secondary">
                  {selectedRequest.studentProfile.major}
                </Text>
              </div>

              <Divider />

              <Descriptions title="Thông tin đăng ký" bordered>
                <Descriptions.Item label="Đề tài" span={3}>
                  {selectedRequest.thesisTitle}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký" span={3}>
                  {selectedRequest.requestDate}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={3}>
                  <Tag color={statusColors[selectedRequest.status]}>
                    {statusText[selectedRequest.status]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Lý do đăng ký" span={3}>
                  {selectedRequest.description}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {selectedRequest.status === "pending" && (
                <div style={{ marginTop: 24, textAlign: "right" }}>
                  <Space>
                    <Button onClick={() => setIsModalVisible(false)}>
                      Đóng
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => setActiveTab("2")}
                    >
                      Từ chối yêu cầu
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      Duyệt yêu cầu
                    </Button>
                  </Space>
                </div>
              )}
            </TabPane>

            {selectedRequest.status === "pending" && (
              <TabPane tab="Gửi phản hồi" key="2">
                <Form
                  form={feedbackForm}
                  layout="vertical"
                  onFinish={handleReject}
                >
                  <Form.Item
                    name="feedback"
                    label="Lý do từ chối"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lý do từ chối!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập lý do từ chối yêu cầu..."
                    />
                  </Form.Item>
                  <Form.Item style={{ textAlign: "right" }}>
                    <Space>
                      <Button onClick={() => setActiveTab("1")}>
                        Quay lại
                      </Button>
                      <Button type="primary" danger htmlType="submit">
                        Gửi phản hồi và từ chối
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </TabPane>
            )}

            {selectedRequest.status === "rejected" && (
              <TabPane tab="Phản hồi đã gửi" key="2">
                <Alert
                  message="Lý do từ chối"
                  description={
                    selectedRequest.feedback || "Không có thông tin phản hồi."
                  }
                  type="error"
                  showIcon
                />
              </TabPane>
            )}
          </Tabs>
        )}
      </Modal>
    </Card>
  );
};

export default ApproveRequests;
