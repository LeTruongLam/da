import { TASK_STATUS } from "@/lib/constants";
import type { RequestDetailResponse } from "@/services/api/request";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Progress, Row, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

type OverviewPartProps = {
  requestData: RequestDetailResponse | undefined | null;
};

const OverviewPartComponent: React.FC<OverviewPartProps> = ({
  requestData,
}) => {
  const tasks = requestData?.tasks || [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.DONE
  ).length;

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card title="Thông tin đồ án">
            <Paragraph>
              <Text strong>Mô tả: </Text>
              {requestData?.thesis.description || "--"}
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
                {requestData?.lecturer.name || "--"}
              </Title>
            </div>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Paragraph>
                <MailOutlined style={{ marginRight: 8 }} />
                {requestData?.lecturer.email || "--"}
              </Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OverviewPartComponent;
