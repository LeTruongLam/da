import { Card, Row, Col, Tag, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { THESIS_STATUS_LABELS } from "@/lib/constants";

const { Title, Text, Paragraph } = Typography;

interface ThesisHeaderProps {
  id: string;
  title: string;
  description: string;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleDemo?: () => void;
  showDemo?: boolean;
}

const statusColors = {
  "Đang mở": "green",
  "Đang thực hiện": "blue",
  "Đã hoàn thành": "purple",
  "Đã đóng": "red",
};

const ThesisHeader: React.FC<ThesisHeaderProps> = ({
  title,
  description,
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
            <Text strong>Trạng thái: </Text>
            <Tag color={statusColors[status as keyof typeof statusColors]}>
              {(typeof status === "string" &&
                THESIS_STATUS_LABELS[
                  status as keyof typeof THESIS_STATUS_LABELS
                ]) ||
                status ||
                "--"}
            </Tag>
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ThesisHeader;
