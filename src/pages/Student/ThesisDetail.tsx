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
  Empty,
  Spin,
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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { UploadProps } from "antd/es/upload/interface";
import { StatusTag } from "@/components/ui";

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

interface FeedbackItem {
  id: string;
  time: string;
  by: string;
  desc: string;
  content: string;
}

interface Thesis {
  id: string;
  title: string;
  description: string;
  supervisor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    expertise: string;
  };
  students?: Student[];
  status: string;
  deadline: string;
  objectives: string;
  requirements: string;
  progress?: number;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

interface Meeting {
  id: string;
  title: string;
  purpose: string;
  date: string;
  time: string;
  thesisId: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  status: string;
  link?: string;
  createdAt: string;
}

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const PAGE_SIZE = 5;

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
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  // States
  const [documentPage, setDocumentPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Forms
  const [meetingForm] = Form.useForm();
  const [submissionForm] = Form.useForm();

  // Fetch thesis details with mock data
  const { data: thesis, isLoading: thesisLoading } = useQuery({
    queryKey: ["thesis", id],
    queryFn: () => {
      if (!id) return null;

      // Replace API call with mock data
      return Promise.resolve<Thesis>({
        id: id,
        title: "Ứng dụng AI trong giáo dục",
        description:
          "Nghiên cứu và phát triển ứng dụng AI hỗ trợ học tập trong giáo dục.",
        supervisor: {
          id: "2",
          name: "TS. Nguyễn Văn A",
          email: "nguyenvana@example.edu.vn",
          phone: "0987654321",
          department: "Công nghệ thông tin",
          expertise: "Trí tuệ nhân tạo, Học máy",
        },
        status: "in_progress",
        deadline: "2024-08-30",
        objectives:
          "Xây dựng ứng dụng demo minh họa việc ứng dụng AI trong giáo dục.",
        requirements:
          "Yêu cầu sinh viên có kiến thức về Machine Learning, Python và các thư viện AI.",
        progress: 60,
        createdAt: "2024-05-15",
      });
    },
    enabled: !!id,
  });

  // Fetch thesis documents with mock data
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["documents", id],
    queryFn: () => {
      if (!id) return [];

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
    enabled: !!id,
  });

  // Fetch thesis tasks with mock data
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => {
      if (!id) return [];

      // Replace API call with mock data
      return Promise.resolve<Task[]>([
        {
          key: "1",
          name: "Nộp đề cương",
          description:
            "Đề cương nghiên cứu, bao gồm mục tiêu, phạm vi, và phương pháp",
          startDate: "2024-06-01",
          deadline: "2024-06-15",
          status: "completed",
          feedback:
            "Tốt, cần bổ sung phần phương pháp nghiên cứu chi tiết hơn.",
          score: 8,
        },
        {
          key: "2",
          name: "Nộp chương 1",
          description:
            "Giới thiệu tổng quan về đề tài, tầm quan trọng và mục tiêu nghiên cứu",
          startDate: "2024-06-16",
          deadline: "2024-07-01",
          status: "completed",
          feedback:
            "Đã đáp ứng yêu cầu, tuy nhiên cần bổ sung thêm tài liệu tham khảo.",
          score: 7,
        },
        {
          key: "3",
          name: "Nộp chương 2",
          description: "Phương pháp nghiên cứu và thiết kế hệ thống",
          startDate: "2024-07-02",
          deadline: "2024-07-20",
          status: "in_progress",
        },
      ]);
    },
    enabled: !!id,
  });

  // Fetch thesis feedback with mock data
  const { data: feedback = [], isLoading: feedbackLoading } = useQuery({
    queryKey: ["feedback", id],
    queryFn: () => {
      if (!id) return [];

      // Replace API call with mock data
      return Promise.resolve<FeedbackItem[]>([
        {
          id: "1",
          time: "2024-06-14",
          by: "Giảng viên",
          desc: "Đánh giá đề cương",
          content:
            "Đề cương tốt, cần bổ sung phần phương pháp nghiên cứu chi tiết hơn.",
        },
        {
          id: "2",
          time: "2024-07-01",
          by: "Giảng viên",
          desc: "Đánh giá chương 1",
          content:
            "Chương 1 đã đáp ứng yêu cầu, tuy nhiên cần bổ sung thêm tài liệu tham khảo.",
        },
      ]);
    },
    enabled: !!id,
  });

  // Fetch meetings with mock data
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery({
    queryKey: ["meetings", user?.userId],
    queryFn: () => {
      if (!user?.userId) return [];

      // Replace API call with mock data
      return Promise.resolve<Meeting[]>([
        {
          id: "meeting1",
          title: "Thảo luận về đề cương",
          purpose: "Thảo luận các nội dung sẽ thực hiện trong đề tài",
          date: "2024-07-15",
          time: "14:30",
          thesisId: id || "",
          teacherId: "2",
          teacherName: "TS. Nguyễn Văn A",
          studentId: user.userId.toString(),
          studentName: user.name,
          status: "approved",
          link: "https://meet.google.com/abc-defg-hij",
          createdAt: "2024-07-10",
        },
        {
          id: "meeting2",
          title: "Báo cáo tiến độ chương 1",
          purpose: "Trình bày kết quả chương 1 và kế hoạch tiếp theo",
          date: "2024-07-25",
          time: "10:00",
          thesisId: id || "",
          teacherId: "2",
          teacherName: "TS. Nguyễn Văn A",
          studentId: user.userId.toString(),
          studentName: user.name,
          status: "pending",
          createdAt: "2024-07-12",
        },
      ]);
    },
    enabled: !!user?.userId && !!id,
  });

  // Pagination helper
  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Calculate progress based on completed tasks
  const progress = tasks.length
    ? Math.round(
        (tasks.filter((t) => t.status === "completed").length / tasks.length) *
          100
      )
    : 0;

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

  // Meeting scheduling with mock implementation
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
      studentId: user.userId.toString(),
      studentName: user.name,
    };

    // Replace API call with mock implementation
    console.log("Scheduling meeting:", meetingRequest);

    // Mock successful API response
    setTimeout(() => {
      message.success(
        "Gửi yêu cầu lịch hẹn thành công! Vui lòng chờ giảng viên xác nhận."
      );
      queryClient.invalidateQueries({ queryKey: ["meetings", user.userId] });
      setIsMeetingModalVisible(false);
      meetingForm.resetFields();
    }, 500);
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

  if (thesisLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải thông tin đồ án..." />
      </div>
    );
  }

  if (!thesis) {
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
                <FileTextOutlined /> {thesis.title}
              </Title>
            </Col>
            <Col>
              <StatusTag type="thesis" status={thesis.status} />
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
                  {feedback.length > 0 ? (
                    <Timeline
                      style={{
                        maxHeight: 300,
                        overflowY: "auto",
                        padding: "16px 8px",
                      }}
                    >
                      {feedback.map((item, index) => (
                        <Timeline.Item
                          key={index}
                          color={item.by === "Giảng viên" ? "blue" : "green"}
                        >
                          <Text strong>{item.time}</Text> - {item.desc}{" "}
                          <Tag>{item.by}</Tag>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Empty description="Chưa có dữ liệu tiến độ" />
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Nhiệm vụ (Tasks)" key="tasks">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Danh sách công việc">
                  {tasksLoading ? (
                    <Spin tip="Đang tải dữ liệu..." />
                  ) : tasks.length > 0 ? (
                    <Table
                      dataSource={tasks}
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
                          render: (status) => (
                            <StatusTag type="task" status={status} />
                          ),
                        },
                        {
                          title: "Điểm",
                          dataIndex: "score",
                          key: "score",
                          render: (score) =>
                            score !== undefined ? score : "--",
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
                            title: "Người tải lên",
                            dataIndex: "uploadedBy",
                            key: "uploadedBy",
                          },
                          {
                            title: "Ngày nộp",
                            dataIndex: "uploadedAt",
                            key: "uploadedAt",
                          },
                          {
                            title: "Thao tác",
                            key: "action",
                            render: () => (
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
                  {meetingsLoading ? (
                    <Spin tip="Đang tải dữ liệu..." />
                  ) : meetings.length > 0 ? (
                    <>
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
                            render: (status) => (
                              <StatusTag type="task" status={status} />
                            ),
                          },
                          {
                            title: "Thao tác",
                            key: "action",
                            render: (_, record) => (
                              <Space>
                                {record.link &&
                                  record.status === "approved" && (
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
                                      message.info(
                                        "Chức năng hủy đang cập nhật"
                                      )
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
                      {meetings.length > PAGE_SIZE && (
                        <Pagination
                          current={meetingPage}
                          pageSize={PAGE_SIZE}
                          total={meetings.length}
                          onChange={setMeetingPage}
                          style={{ marginTop: 16, textAlign: "right" }}
                          hideOnSinglePage
                        />
                      )}
                    </>
                  ) : (
                    <Empty description="Chưa có lịch họp nào" />
                  )}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Nhận xét" key="feedback">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Nhận xét từ giảng viên">
                  {feedbackLoading ? (
                    <Spin tip="Đang tải dữ liệu..." />
                  ) : feedback.length > 0 ? (
                    <Timeline style={{ padding: "16px 8px" }}>
                      {feedback.map((fb, index) => (
                        <Timeline.Item key={index} color="blue">
                          <Text strong>{fb.time}</Text>
                          <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                            {fb.content}
                          </Paragraph>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Empty description="Chưa có nhận xét nào từ giảng viên" />
                  )}
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
