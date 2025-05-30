import { Card, Row, Col, Tag, Typography } from "antd";
import type { RequestDetailResponse } from "@/services/api/request";

const { Title, Text, Paragraph } = Typography;

interface ThesisHeaderProps {
  requestData: RequestDetailResponse | undefined | null;
}

const ThesisHeader: React.FC<ThesisHeaderProps> = ({ requestData }) => {
  return (
    <Card
      type="inner"
      title={<Title level={4}>{requestData?.thesis.title || "--"}</Title>}
    >
      <Row gutter={24}>
        <Col span={16}>
          <Paragraph>
            <Text strong>Mô tả: </Text>
            {requestData?.thesis.description || "--"}
          </Paragraph>
        </Col>
        <Col span={8}>
          <Paragraph>
            <Text strong>Trạng thái: </Text>
            <Tag>{requestData?.thesis.status}</Tag>
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ThesisHeader;
