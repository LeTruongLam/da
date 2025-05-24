import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Button,
  Rate,
  Table,
  Statistic,
  Progress,
  Tag,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { SubTask } from "./TasksTable";
import type { Document } from "./DocumentsTable";
import type { Student } from "./StudentCard";

const { Title, Text, Paragraph } = Typography;

interface StudentEvaluationProps {
  student: Student | null;
  documents: Document[];
  onEvaluate: (student: Student) => void;
  onTaskFeedback: (student: Student, task: SubTask) => void;
  onUpdateProgress: (student: Student) => void;
  onComment: (document: Document) => void;
}

const StudentEvaluation: React.FC<StudentEvaluationProps> = ({
  student,
  documents,
  onEvaluate,
  onTaskFeedback,
  onUpdateProgress,
  onComment,
}) => {
  if (!student) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Title level={4}>
          Vui lòng chọn sinh viên để xem chi tiết đánh giá
        </Title>
      </div>
    );
  }

  const getTaskStatusTag = (status?: string) => {
    if (!status) return <Tag>Chưa bắt đầu</Tag>;

    const statusConfig = {
      not_started: { color: "default", text: "Chưa bắt đầu" },
      in_progress: { color: "processing", text: "Đang thực hiện" },
      completed: { color: "success", text: "Hoàn thành" },
      late: { color: "error", text: "Trễ hạn" },
    };

    const { color, text } =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.not_started;
    return <Tag color={color}>{text}</Tag>;
  };

  const studentDocuments = documents.filter(
    (doc) => doc.uploadedBy === student.name
  );

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={24}>
            <Col span={16}>
              <Title level={5}>
                <UserOutlined /> {student.name} ({student.studentId})
              </Title>
              {student.email && (
                <Paragraph>
                  <Text strong>Email: </Text>
                  {student.email}
                </Paragraph>
              )}
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Space direction="vertical" align="end">
                <div>
                  <Text strong>Đánh giá hiện tại: </Text>
                  <Rate
                    disabled
                    value={student.rating}
                    style={{ marginLeft: 8 }}
                    className={student.rating === 0 ? "not-rated" : "active"}
                  />
                </div>
                <Space style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    icon={<StarOutlined />}
                    onClick={() => onEvaluate(student)}
                  >
                    Đánh giá
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Các nhiệm vụ và tiến độ">
          <Table
            columns={[
              {
                title: "Nhiệm vụ",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                  <Space>
                    {record.status === "completed" ? (
                      <CheckCircleOutlined style={{ color: "green" }} />
                    ) : record.status === "late" ? (
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    ) : (
                      <ClockCircleOutlined />
                    )}
                    {text}
                  </Space>
                ),
              },
              {
                title: "Mô tả",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                width: 200,
              },
              {
                title: "Deadline",
                dataIndex: "deadline",
                key: "deadline",
              },
              {
                title: "Ngày nộp",
                dataIndex: "submittedAt",
                key: "submittedAt",
                render: (text) => text || "--",
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
                    {record.status === "completed" ||
                    record.status === "late" ? (
                      <Button
                        type="link"
                        icon={<CommentOutlined />}
                        onClick={() => onTaskFeedback(student, record)}
                      >
                        Đánh giá
                      </Button>
                    ) : (
                      <Button type="link" disabled>
                        Chưa nộp
                      </Button>
                    )}
                    {record.status === "completed" ||
                    record.status === "late" ? (
                      <Button type="link" icon={<DownloadOutlined />}>
                        Tải xuống
                      </Button>
                    ) : null}
                  </Space>
                ),
              },
            ]}
            dataSource={student.submittedTasks || []}
            pagination={false}
            rowKey="key"
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Tài liệu sinh viên đã nộp">
          <Table
            columns={[
              {
                title: "Tên tài liệu",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                  <Space>
                    <FileTextOutlined />
                    <a
                      href={record.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  </Space>
                ),
              },
              {
                title: "Ngày nộp",
                dataIndex: "uploadedAt",
                key: "uploadedAt",
              },
              {
                title: "Kích thước",
                dataIndex: "size",
                key: "size",
              },
              {
                title: "Thao tác",
                key: "action",
                render: (_, record) => (
                  <Space>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Tải xuống
                    </Button>
                    <Button
                      type="link"
                      icon={<CommentOutlined />}
                      onClick={() => onComment(record)}
                    >
                      Nhận xét
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={studentDocuments}
            pagination={false}
            rowKey="key"
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Đánh giá tiến độ thực hiện đồ án">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Tiến độ hoàn thành"
                value={student.progress}
                suffix="%"
                valueStyle={{
                  color:
                    student.progress < 40
                      ? "red"
                      : student.progress < 70
                      ? "orange"
                      : "green",
                }}
              />
              <Progress
                percent={student.progress}
                status={student.progress < 40 ? "exception" : "active"}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Số nhiệm vụ đã hoàn thành"
                value={
                  (student.submittedTasks || []).filter(
                    (task) => task.status === "completed"
                  ).length
                }
                suffix={`/ ${student.submittedTasks?.length || 0}`}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentEvaluation;
