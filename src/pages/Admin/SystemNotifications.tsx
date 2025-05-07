import {
  Card,
  Button,
  Timeline,
  Typography,
  Space,
  Tag,
  Pagination,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { BellOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { notifications } from "../../mocks/dashboardData";

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const PAGE_SIZE = 5;

const SystemNotifications = () => {
  const [notificationPage, setNotificationPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Simulate adding a notification
  interface NotificationForm {
    title: string;
    content: string;
    type: string;
    target: string;
  }

  const addNotification = (values: NotificationForm) => {
    console.log("New notification:", values);
    message.success("Thông báo hệ thống đã được gửi!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getNotificationIcon = () => {
    return <BellOutlined style={{ color: "#1890ff" }} />;
  };

  const getNotificationColor = (status: string) => {
    return status === "unread" ? "#f5222d" : "#8c8c8c";
  };

  const handleCreate = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Thông báo hệ thống</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo thông báo mới
        </Button>
      </div>

      <Card
        title="Danh sách thông báo"
        style={{ marginBottom: 24 }}
        bodyStyle={{ maxHeight: 600, overflow: "auto", padding: "12px 24px" }}
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
                <div className="flex justify-between">
                  <Tag color={item.status === "unread" ? "red" : "default"}>
                    {item.status === "unread" ? "Chưa đọc" : "Đã đọc"}
                  </Tag>
                  <Tag color="blue">
                    {item.type === "meeting" ? "Lịch họp" : "Công việc"}
                  </Tag>
                </div>
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

      <Modal
        title="Tạo thông báo hệ thống mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={addNotification}>
          <Form.Item
            name="title"
            label="Tiêu đề thông báo"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề thông báo" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung thông báo"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung thông báo" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung chi tiết của thông báo"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại thông báo"
            rules={[
              { required: true, message: "Vui lòng chọn loại thông báo" },
            ]}
          >
            <Select placeholder="Chọn loại thông báo">
              <Option value="system">Thông báo hệ thống</Option>
              <Option value="maintenance">Bảo trì hệ thống</Option>
              <Option value="update">Cập nhật tính năng</Option>
              <Option value="announcement">Thông báo chung</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="target"
            label="Đối tượng nhận thông báo"
            rules={[
              { required: true, message: "Vui lòng chọn đối tượng nhận" },
            ]}
          >
            <Select placeholder="Chọn đối tượng nhận thông báo">
              <Option value="all">Tất cả người dùng</Option>
              <Option value="students">Chỉ sinh viên</Option>
              <Option value="teachers">Chỉ giảng viên</Option>
              <Option value="admins">Chỉ quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Gửi thông báo
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemNotifications;
