import {
  Card,
  Row,
  Col,
  Progress,
  Space,
  Typography,
  Button,
  Rate,
} from "antd";
import {
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { SubTask } from "./TasksTable";

const { Title, Text, Paragraph } = Typography;

export interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
  submittedTasks?: SubTask[];
}

interface StudentCardProps {
  student: Student | null;
  onEvaluate: (student: Student) => void;
  onScheduleMeeting: (student: Student) => void;
  onAddStudent?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEvaluate,
  onScheduleMeeting,
  onAddStudent,
}) => {
  if (!student) {
    return (
      <Card title="Sinh viên đăng ký">
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p>Chưa có sinh viên đăng ký đề tài này</p>
          <Button type="primary" icon={<UserOutlined />} onClick={onAddStudent}>
            Thêm sinh viên
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Sinh viên đăng ký">
      <Row gutter={24}>
        <Col span={16}>
          <Title level={5}>
            <UserOutlined /> {student.name}
          </Title>
          {student.email && (
            <Paragraph>
              <Text strong>Email: </Text>
              {student.email}
            </Paragraph>
          )}
        </Col>
        <Col span={8}>
          <div>
            <Text strong>Tiến độ: </Text>
            <Progress
              percent={student.progress}
              size="small"
              status={student.progress < 40 ? "exception" : "active"}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <Text strong>Đánh giá: </Text>
            <Rate disabled defaultValue={student.rating} />
          </div>
          <Space style={{ marginTop: 24 }}>
            <Button icon={<StarOutlined />} onClick={() => onEvaluate(student)}>
              Đánh giá
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => onScheduleMeeting(student)}
            >
              Lịch họp
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentCard;
