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
import { UserOutlined, StarOutlined } from "@ant-design/icons";

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
        {/* <Col span={8}>
          <div style={{ marginTop: 16 }}>
            <Text strong>Đánh giá: </Text>
            <Rate disabled defaultValue={4} />
          </div>
          <Space style={{ marginTop: 24 }}>
            <Button icon={<StarOutlined />}>Đánh giá</Button>
          </Space>
        </Col> */}
      </Row>
    </Card>
  );
};

export default StudentCard;
