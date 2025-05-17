import { Card, Row, Col, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusTag } from "@/components/ui";

const { Title, Text, Paragraph } = Typography;

interface ThesisHeaderProps {
  id: string;
  title: string;
  description: string;
  major: string | { majorName: string } | any;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleDemo?: () => void;
  showDemo?: boolean;
}

const ThesisHeader: React.FC<ThesisHeaderProps> = ({
  title,
  description,
  major,
  status,
  onEdit,
  onDelete,
  onToggleDemo,
  showDemo = false,
}) => {
  return (
    <Card
      type="inner"
      title={<Title level={4}>{title || "--"}</Title>}
      extra={
        <Space>
          <Button icon={<EditOutlined />} onClick={onEdit}>
            Chỉnh sửa
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={onDelete}>
            Xóa
          </Button>
          {onToggleDemo && (
            <Button type="dashed" onClick={onToggleDemo}>
              {showDemo ? "Demo: Không có SV" : "Demo: Có SV"}
            </Button>
          )}
        </Space>
      }
    >
      <Row gutter={24}>
        <Col span={16}>
          <Paragraph>
            <Text strong>Mô tả: </Text>
            {description || "--"}
          </Paragraph>
        </Col>
        <Col span={8}>
          <Paragraph>
            <Text strong>Chuyên ngành: </Text>
            {typeof major === "object" && major?.majorName
              ? major.majorName
              : major || "--"}
          </Paragraph>
          <Paragraph>
            <Text strong>Trạng thái: </Text>
            <StatusTag
              type="thesis"
              status={status}
              faculty={
                typeof major === "object" && major?.majorName
                  ? major.majorName
                  : major || "--"
              }
            />
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ThesisHeader;
