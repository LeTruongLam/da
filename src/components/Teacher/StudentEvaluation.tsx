import React from "react";
import {
  Card,
  Button,
  Table,
  Space,
  Typography,
  Rate,
  Row,
  Col,
  Tag,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { styles, props } from "./styles";

const { Title, Text, Paragraph } = Typography;

interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
  submittedTasks: SubTask[];
}

interface SubTask {
  key: string;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  status?: "not_started" | "in_progress" | "completed" | "late";
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

interface StudentEvaluationProps {
  student: Student;
  onEvaluate: (student: Student) => void;
  onScheduleMeeting: (student: Student) => void;
  onTaskFeedback: (student: Student, task: SubTask) => void;
}

const StudentEvaluation: React.FC<StudentEvaluationProps> = ({
  student,
  onEvaluate,
  onScheduleMeeting,
  onTaskFeedback,
}) => {
  // Function to generate status tag for tasks
  const getTaskStatusTag = (status?: string) => {
    if (!status) return <Tag>Chưa bắt đầu</Tag>;

    const statusConfig = {
      not_started: { color: "default", text: "Chưa bắt đầu", icon: null },
      in_progress: {
        color: "processing",
        text: "Đang thực hiện",
        icon: <ClockCircleOutlined />,
      },
      completed: {
        color: "success",
        text: "Hoàn thành",
        icon: <CheckCircleOutlined />,
      },
      late: {
        color: "error",
        text: "Trễ hạn",
        icon: <ExclamationCircleOutlined />,
      },
    };

    const { color, text, icon } =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.not_started;

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const taskColumns = [
    {
      title: "Nhiệm vụ",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SubTask) => (
        <Space>
          {record.status === "completed" ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : record.status === "late" ? (
            <ExclamationCircleOutlined style={{ color: "red" }} />
          ) : (
            <ClockCircleOutlined style={{ color: "blue" }} />
          )}
          {text}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: unknown, record: SubTask) => getTaskStatusTag(record.status),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Đánh giá",
      key: "score",
      render: (_: unknown, record: SubTask) => (
        <>
          {record.score !== undefined ? (
            <span>{record.score}/10</span>
          ) : (
            <span>Chưa đánh giá</span>
          )}
        </>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: SubTask) => (
        <Button
          type="link"
          onClick={() => onTaskFeedback(student, record)}
          size={props.button.size}
        >
          Đánh giá
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row gutter={styles.rowGutter}>
        <Col span={24}>
          <Card style={styles.cardSpacing}>
            <Row gutter={styles.rowGutter}>
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
                {student.phone && (
                  <Paragraph>
                    <Text strong>SĐT: </Text>
                    {student.phone}
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
                      size={props.button.size}
                    >
                      Đánh giá
                    </Button>
                    <Button
                      icon={<CalendarOutlined />}
                      onClick={() => onScheduleMeeting(student)}
                      size={props.button.size}
                    >
                      Lịch họp
                    </Button>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Các nhiệm vụ và tiến độ" style={styles.cardSpacing}>
            <div style={styles.tableContainer}>
              <Table
                columns={taskColumns}
                dataSource={student.submittedTasks}
                pagination={false}
                size={props.table.size}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StudentEvaluation;
