import React from "react";
import { Card, Row, Col, Typography, Space, Button } from "antd";
import {
  UserOutlined,
  EyeOutlined,
  StarOutlined,
  CalendarOutlined,
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
}

interface StudentSectionProps {
  student: Student | null;
  onViewDetails: (student: Student) => void;
  onEvaluate: (student: Student) => void;
  onScheduleMeeting: (student: Student) => void;
  onAddStudent?: () => void;
}

const StudentSection: React.FC<StudentSectionProps> = ({
  student,
  onViewDetails,
  onEvaluate,
  onScheduleMeeting,
  onAddStudent,
}) => {
  return (
    <Card
      title="Sinh viên đăng ký"
      style={styles.cardSpacing}
      extra={
        !student && (
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={onAddStudent}
            size={props.button.size}
          >
            Thêm sinh viên
          </Button>
        )
      }
    >
      {student ? (
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
              <Space style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(student)}
                  size={props.button.size}
                >
                  Chi tiết
                </Button>
                <Button
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
      ) : (
        <Paragraph>Chưa có sinh viên đăng ký đề tài này.</Paragraph>
      )}
    </Card>
  );
};

export default StudentSection;
