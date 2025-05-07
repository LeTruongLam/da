import {
  Card,
  Row,
  Col,
  Table,
  Statistic,
  Tag,
  Pagination,
  Timeline,
  Typography,
  Space,
} from "antd";
import { TeamOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { notifications } from "../../mocks/dashboardData";

const { Text } = Typography;
const PAGE_SIZE = 5;

// Giả lập dữ liệu người dùng
const users = Array.from({ length: 18 }).map((_, i) => ({
  key: String(i + 1),
  name: `Người dùng ${String.fromCharCode(65 + i)}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "admin" : i % 3 === 1 ? "teacher" : "student",
}));

const AdminDashboard = () => {
  const [userPage, setUserPage] = useState(1);
  const [notificationPage, setNotificationPage] = useState(1);

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getNotificationIcon = () => {
    return <BellOutlined style={{ color: "#1890ff" }} />;
  };

  const getNotificationColor = (status: string) => {
    return status === "unread" ? "#f5222d" : "#8c8c8c";
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard Quản trị viên</h2>

      <Card
        title="Thông báo hệ thống"
        style={{ marginBottom: 24 }}
        bodyStyle={{ maxHeight: 400, overflow: "auto", padding: "12px 24px" }}
      >
        <Timeline
          mode="left"
          items={paged(notifications, notificationPage).map((item) => ({
            color: getNotificationColor(item.status),
            label: <Text type="secondary">{item.sent}</Text>,
            dot: getNotificationIcon(),
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

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={users.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách người dùng" style={{ marginTop: 24 }}>
        <Table
          columns={[
            {
              title: "Họ tên",
              dataIndex: "name",
              key: "name",
              render: (name) => (
                <>
                  <UserOutlined /> {name}
                </>
              ),
            },
            { title: "Email", dataIndex: "email", key: "email" },
            {
              title: "Vai trò",
              dataIndex: "role",
              key: "role",
              render: (role) => (
                <Tag
                  color={
                    role === "admin"
                      ? "red"
                      : role === "teacher"
                      ? "green"
                      : "blue"
                  }
                >
                  {role}
                </Tag>
              ),
            },
          ]}
          dataSource={paged(users, userPage)}
          pagination={false}
          scroll={{ y: 200 }}
        />
        <Pagination
          current={userPage}
          pageSize={PAGE_SIZE}
          total={users.length}
          onChange={setUserPage}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
