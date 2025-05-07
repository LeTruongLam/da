import {
  Card,
  Pagination,
  Timeline,
  Typography,
  Tag,
  Space,
  Modal,
  Button,
} from "antd";
import {
  BellOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { notifications } from "../../mocks/dashboardData";

const { Text } = Typography;
const PAGE_SIZE = 5;

// Define type for notification
interface Notification {
  key: string;
  title: string;
  message: string;
  type: string;
  status: string;
  sent: string;
}

const StudentDashboard = () => {
  const [notificationPage, setNotificationPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const showNotificationDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getNotificationTypeTag = (type: string) => {
    if (type === "meeting") {
      return <Tag color="blue">Lịch họp</Tag>;
    }
    return <Tag color="green">Công việc</Tag>;
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard Sinh viên</h2>

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
              <div
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "4px",
                  transition: "background-color 0.3s",
                  backgroundColor:
                    item.status === "unread" ? "#f0f8ff" : "transparent",
                }}
                onClick={() => showNotificationDetails(item)}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      strong={item.status === "unread"}
                      style={{
                        fontSize: 15,
                        color: item.status === "unread" ? "#000000" : "#595959",
                      }}
                    >
                      {item.title}
                    </Text>
                    <RightOutlined style={{ fontSize: 12, color: "#bfbfbf" }} />
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {getNotificationTypeTag(item.type)}
                    {item.status === "unread" && <Tag color="red">Mới</Tag>}
                  </div>
                </Space>
              </div>
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

      <Modal
        title={selectedNotification?.title}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedNotification && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">
                  Thời gian: {selectedNotification.sent}
                </Text>
                {getNotificationTypeTag(selectedNotification.type)}
              </div>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <Text style={{ whiteSpace: "pre-line" }}>
                  {selectedNotification.message}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;
