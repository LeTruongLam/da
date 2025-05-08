import {
  Card,
  Row,
  Col,
  Progress,
  Table,
  Tag,
  Pagination,
  Timeline,
  Button,
  message,
  Tabs,
  Form,
  Input,
  Upload,
  Modal,
  DatePicker,
  Typography,
  Avatar,
  Space,
  Alert,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CommentOutlined,
  UploadOutlined,
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { api } from "../../services/api";
import type { UploadProps } from "antd/es/upload/interface";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const PAGE_SIZE = 5;

// Mock dữ liệu đồ án
const mockThesis = {
  id: "1",
  title: "Ứng dụng AI trong giáo dục",
  supervisor: {
    id: "2",
    name: "TS. Nguyễn Văn A",
    email: "nguyenvana@example.edu.vn",
    phone: "0987654321",
    department: "Công nghệ thông tin",
    expertise: "Trí tuệ nhân tạo, Học máy",
  },
  description: "Nghiên cứu và phát triển ứng dụng AI hỗ trợ học tập.",
  status: "in_progress",
  deadline: "2024-09-30",
  requirements: "Yêu cầu sinh viên có kiến thức về AI và học máy.",
  objectives: "Xây dựng ứng dụng demo AI hỗ trợ học tập cá nhân hóa.",
};

const progressHistory = [
  { key: 1, time: "2024-06-01", desc: "Bắt đầu đề tài", by: "Sinh viên" },
  { key: 2, time: "2024-06-10", desc: "Nộp đề cương", by: "Sinh viên" },
  { key: 3, time: "2024-06-12", desc: "Nhận xét đề cương", by: "Giảng viên" },
  { key: 4, time: "2024-06-20", desc: "Nộp chương 1", by: "Sinh viên" },
  { key: 5, time: "2024-06-22", desc: "Nhận xét chương 1", by: "Giảng viên" },
];

const mockDocuments = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i + 1),
  name: `Tài liệu ${i + 1}.${
    i % 3 === 0 ? "pdf" : i % 3 === 1 ? "docx" : "zip"
  }`,
  type: i % 3 === 0 ? "pdf" : i % 3 === 1 ? "docx" : "zip",
  uploadedAt: `2024-06-${10 + (i % 10)}`,
  status: i % 4 === 0 ? "approved" : "pending",
  url: "#",
}));

const mockFeedbacks = [
  {
    key: 1,
    time: "2024-06-12",
    by: "Giảng viên",
    content: "Đề cương cần bổ sung mục tiêu rõ ràng hơn.",
  },
  {
    key: 2,
    time: "2024-06-22",
    by: "Giảng viên",
    content: "Chương 1 trình bày tốt, cần bổ sung ví dụ thực tế.",
  },
];

interface StatusMapType {
  [key: string]: { color: string; text: string };
}

const statusMap: StatusMapType = {
  approved: { color: "green", text: "Đã duyệt" },
  pending: { color: "orange", text: "Chờ duyệt" },
};

const mockSubTasks = [
  {
    key: "1",
    name: "Nộp đề cương",
    startDate: "2024-06-01",
    deadline: "2024-06-15",
    description: "Nộp đề cương chi tiết của đồ án",
    status: "completed",
    score: 8,
    feedback: "Đề cương tốt, cần bổ sung thêm mục tiêu cụ thể hơn",
  },
  {
    key: "2",
    name: "Nộp chương 1",
    startDate: "2024-06-16",
    deadline: "2024-06-30",
    description: "Nộp chương 1: Tổng quan",
    status: "completed",
    score: 7.5,
    feedback: "Chương 1 trình bày khá tốt, cần thêm ví dụ minh họa",
  },
  {
    key: "3",
    name: "Nộp chương 2",
    startDate: "2024-07-01",
    deadline: "2024-07-15",
    description: "Nộp chương 2: Phương pháp nghiên cứu",
    status: "in_progress",
  },
  {
    key: "4",
    name: "Nộp chương 3",
    startDate: "2024-07-16",
    deadline: "2024-08-15",
    description: "Nộp chương 3: Kết quả và thảo luận",
    status: "not_started",
  },
  {
    key: "5",
    name: "Nộp báo cáo tổng kết",
    startDate: "2024-08-16",
    deadline: "2024-09-15",
    description: "Nộp báo cáo tổng kết đầy đủ",
    status: "not_started",
  },
];

interface MeetingFormValues {
  title: string;
  purpose: string;
  date: string;
  time: string;
}

interface SubmissionFormValues {
  taskId: string;
  taskName: string;
  note: string;
}

const ThesisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  // States
  const [documentPage, setDocumentPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Forms
  const [meetingForm] = Form.useForm();
  const [submissionForm] = Form.useForm();

  // Fetch meetings from API
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery({
    queryKey: ["meetings", user?.id],
    queryFn: () => api.getMeetings(user?.id || ""),
    enabled: !!user?.id,
  });

  // Pagination helper
  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Calculate progress based on completed tasks
  const progress = Math.round(
    (mockSubTasks.filter((t) => t.status === "completed").length /
      mockSubTasks.length) *
      100
  );

  // Mock thesis data (in a real app, this would come from an API)
  const [thesis] = useState(mockThesis);

  // Use React Query to fetch thesis data
  useEffect(() => {
    // In a real app, you would fetch the thesis data based on the ID
    console.log("Fetching thesis with ID:", id);
  }, [id]);

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

  // Meeting scheduling
  const handleScheduleMeeting = (values: MeetingFormValues) => {
    if (!user || !thesis) return;

    const meetingRequest = {
      title: values.title,
      purpose: values.purpose,
      date: values.date,
      time: values.time,
      thesisId: thesis.id,
      teacherId: thesis.supervisor.id,
      teacherName: thesis.supervisor.name,
      studentId: user.id,
      studentName: user.name,
    };

    // Call the API
    api
      .scheduleMeeting(
        meetingRequest.title,
        meetingRequest.purpose,
        meetingRequest.date,
        meetingRequest.time,
        meetingRequest.thesisId,
        meetingRequest.teacherId,
        meetingRequest.teacherName,
        meetingRequest.studentId,
        meetingRequest.studentName
      )
      .then(() => {
        message.success(
          "Gửi yêu cầu lịch hẹn thành công! Vui lòng chờ giảng viên xác nhận."
        );
        queryClient.invalidateQueries({ queryKey: ["meetings", user.id] });
        setIsMeetingModalVisible(false);
        meetingForm.resetFields();
      })
      .catch((error) => {
        message.error(`Lỗi: ${error.message}`);
      });
  };

  // Document submission
  const handleSubmitTask = (values: SubmissionFormValues) => {
    console.log("Task submission:", values);
    message.success("Nộp bài tập thành công!");
    setIsSubmissionModalVisible(false);
    submissionForm.resetFields();
  };

  // Show submission modal for a specific task
  const showSubmissionModal = (task: any) => {
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

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
      <Card
        title={
          <Row align="middle" gutter={16}>
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                <FileTextOutlined /> {thesis.title}
              </Title>
            </Col>
            <Col>
              <Tag color={thesis.status === "in_progress" ? "blue" : "green"}>
                {thesis.status === "in_progress"
                  ? "Đang thực hiện"
                  : "Hoàn thành"}
              </Tag>
            </Col>
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
                    {thesis.description}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Yêu cầu: </Text>
                    {thesis.requirements}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Mục tiêu: </Text>
                    {thesis.objectives}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Deadline: </Text>
                    {thesis.deadline}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Tiến độ tổng thể: </Text>
                  </Paragraph>
                  <Progress
                    percent={progress}
                    status={progress === 100 ? "success" : "active"}
                  />
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card title="Giảng viên hướng dẫn">
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                      {thesis.supervisor.name}
                    </Title>
                    <Text type="secondary">{thesis.supervisor.department}</Text>
                  </div>

                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Paragraph>
                      <MailOutlined style={{ marginRight: 8 }} />
                      {thesis.supervisor.email}
                    </Paragraph>
                    <Paragraph>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {thesis.supervisor.phone}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Chuyên môn: </Text>
                      {thesis.supervisor.expertise}
                    </Paragraph>
                  </Space>

                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    style={{ marginTop: 16, width: "100%" }}
                    onClick={() => setIsMeetingModalVisible(true)}
                  >
                    Đặt lịch hẹn
                  </Button>
                </Card>
              </Col>

              <Col span={24}>
                <Card
                  title="Lịch sử tiến độ"
                  extra={<Tag color="blue">Thời gian gần nhất</Tag>}
                >
                  <Timeline
                    style={{
                      maxHeight: 300,
                      overflowY: "auto",
                      padding: "16px 8px",
                    }}
                  >
                    {progressHistory.map((item) => (
                      <Timeline.Item
                        key={item.key}
                        color={item.by === "Giảng viên" ? "blue" : "green"}
                      >
                        <Text strong>{item.time}</Text> - {item.desc}{" "}
                        <Tag>{item.by}</Tag>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Nhiệm vụ (Tasks)" key="tasks">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Danh sách công việc">
                  <Table
                    dataSource={mockSubTasks}
                    rowKey="key"
                    columns={[
                      {
                        title: "Tên công việc",
                        dataIndex: "name",
                        key: "name",
                        render: (text) => (
                          <Space>
                            <FileTextOutlined />
                            <Text strong>{text}</Text>
                          </Space>
                        ),
                      },
                      {
                        title: "Bắt đầu",
                        dataIndex: "startDate",
                        key: "startDate",
                      },
                      {
                        title: "Deadline",
                        dataIndex: "deadline",
                        key: "deadline",
                      },
                      {
                        title: "Mô tả",
                        dataIndex: "description",
                        key: "description",
                        ellipsis: true,
                      },
                      {
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => getTaskStatusTag(status),
                      },
                      {
                        title: "Điểm",
                        dataIndex: "score",
                        key: "score",
                        render: (score) => (score !== undefined ? score : "--"),
                      },
                      {
                        title: "Thao tác",
                        key: "action",
                        render: (_, record) => (
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
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Tài liệu" key="documents">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card
                  title="Tài liệu đã nộp"
                  extra={
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={() => setIsSubmissionModalVisible(true)}
                    >
                      Tải lên tài liệu mới
                    </Button>
                  }
                >
                  <Table
                    columns={[
                      {
                        title: "Tên file",
                        dataIndex: "name",
                        key: "name",
                        render: (name, record) => (
                          <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileTextOutlined /> {name}
                          </a>
                        ),
                      },
                      { title: "Loại", dataIndex: "type", key: "type" },
                      {
                        title: "Ngày nộp",
                        dataIndex: "uploadedAt",
                        key: "uploadedAt",
                      },
                      {
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => (
                          <Tag color={statusMap[status].color}>
                            {statusMap[status].text}
                          </Tag>
                        ),
                      },
                      {
                        title: "Thao tác",
                        key: "action",
                        render: (_, record) => (
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              message.info("Chức năng xóa đang cập nhật")
                            }
                          >
                            Xóa
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={paged(mockDocuments, documentPage)}
                    pagination={false}
                  />
                  <Pagination
                    current={documentPage}
                    pageSize={PAGE_SIZE}
                    total={mockDocuments.length}
                    onChange={setDocumentPage}
                    style={{ marginTop: 16, textAlign: "right" }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Lịch họp" key="meetings">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card
                  title="Lịch họp với giảng viên"
                  extra={
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => setIsMeetingModalVisible(true)}
                    >
                      Đặt lịch hẹn mới
                    </Button>
                  }
                >
                  <Table
                    loading={meetingsLoading}
                    columns={[
                      {
                        title: "Tiêu đề",
                        dataIndex: "title",
                        key: "title",
                      },
                      {
                        title: "Ngày",
                        dataIndex: "date",
                        key: "date",
                      },
                      {
                        title: "Giờ",
                        dataIndex: "time",
                        key: "time",
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
                        render: (_, record) => (
                          <Space>
                            {record.link && record.status === "approved" && (
                              <Button
                                type="primary"
                                href={record.link}
                                target="_blank"
                              >
                                Tham gia
                              </Button>
                            )}
                            {record.status === "pending" && (
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  message.info("Chức năng hủy đang cập nhật")
                                }
                              >
                                Hủy
                              </Button>
                            )}
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={paged(meetings, meetingPage)}
                    pagination={false}
                  />
                  <Pagination
                    current={meetingPage}
                    pageSize={PAGE_SIZE}
                    total={meetings.length}
                    onChange={setMeetingPage}
                    style={{ marginTop: 16, textAlign: "right" }}
                    hideOnSinglePage
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Nhận xét" key="feedback">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Nhận xét từ giảng viên">
                  <Timeline style={{ padding: "16px 8px" }}>
                    {mockFeedbacks.map((fb) => (
                      <Timeline.Item key={fb.key} color="blue">
                        <Text strong>{fb.time}</Text>
                        <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                          {fb.content}
                        </Paragraph>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal đặt lịch hẹn */}
      <Modal
        title="Đặt lịch hẹn với giảng viên"
        open={isMeetingModalVisible}
        onCancel={() => setIsMeetingModalVisible(false)}
        footer={null}
      >
        <Form
          form={meetingForm}
          layout="vertical"
          onFinish={handleScheduleMeeting}
        >
          <Form.Item
            name="title"
            label="Tiêu đề cuộc họp"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề cuộc họp!" },
            ]}
          >
            <Input placeholder="VD: Thảo luận về chương 2..." />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Mục đích cuộc họp"
            rules={[
              { required: true, message: "Vui lòng nhập mục đích cuộc họp!" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả mục đích và nội dung muốn trao đổi..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày đề xuất"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Giờ đề xuất"
                rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
              >
                <Input placeholder="VD: 14:30" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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

export default ThesisDetail;
