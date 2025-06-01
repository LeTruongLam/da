import {
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

type StudentType = {
  user_id: number;
  name: string;
  code: string;
  email: string;
};
interface StudentCardProps {
  student?: StudentType;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  return (
    <Card title="Sinh viên đăng ký">
      <Row gutter={24}>
        <Col span={16}>
          <Title level={5}>
            <UserOutlined /> {student?.name || "--"}
          </Title>
          <Paragraph>
            <Text strong>Email: </Text>
            {student?.email || "--"}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentCard;
