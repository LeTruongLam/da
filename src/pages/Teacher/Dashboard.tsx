import { Card, Tag, Pagination, Space, Timeline, Typography } from "antd";
import { ClockCircleOutlined, BellOutlined } from "@ant-design/icons";
import { useState } from "react";
import { notifications } from "../../mocks/dashboardData";

const { Text } = Typography;
const PAGE_SIZE = 5;

const TeacherDashboard = () => {
  const [notificationPage, setNotificationPage] = useState(1);

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getNotificationIcon = (type: string) => {
    return type === "meeting" ? (
      <ClockCircleOutlined style={{ color: "#1890ff" }} />
    ) : (
      <BellOutlined style={{ color: "#52c41a" }} />
    );
  };

  const getNotificationColor = (status: string) => {
    return status === "unread" ? "#f5222d" : "#8c8c8c";
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard Giảng viên</h2>

      <Card
        title="Thông báo mới nhất"
        style={{ marginBottom: 24 }}
        bodyStyle={{ maxHeight: 600, overflow: "auto", padding: "12px 24px" }}
      >
        <Timeline
          mode="left"
          items={paged(notifications, notificationPage).map((item) => ({
            color: getNotificationColor(item.status),
            label: <Text type="secondary">{item.sent}</Text>,
            dot: getNotificationIcon(item.type),
            children: (
              <Space direction="vertical" style={{ display: "flex" }}>
                <Text
                  strong={item.status === "unread"}
                  style={{
                    fontSize: 15,
                    color: item.status === "unread" ? "#000000" : "#595959",
                  }}
                >
                  {item.message}
                </Text>
                <Tag color={item.status === "unread" ? "red" : "default"}>
                  {item.status === "unread" ? "Chưa đọc" : "Đã đọc"}
                </Tag>
              </Space>
            ),
          }))}
        />
        <Pagination
          current={notificationPage}
          pageSize={PAGE_SIZE}
          total={notifications.length}
          onChange={setNotificationPage}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard;
