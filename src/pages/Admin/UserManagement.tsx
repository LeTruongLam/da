import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { UserRole } from "../../store/slices/authSlice";
import type { UserForm } from "../../types/pages/Admin/UserManagement";
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  TABLE_PAGE_SIZE,
} from "../../lib/constants";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      Promise.resolve([
        {
          id: "1",
          email: "student@student.edu.vn",
          name: "Nguyễn Văn A",
          role: "student",
        },
        {
          id: "2",
          email: "teacher@teacher.edu.vn",
          name: "Trần Thị B",
          role: "teacher",
        },
        {
          id: "3",
          email: "admin@admin.edu.vn",
          name: "Lê Văn C",
          role: "admin",
        },
      ]),
  });

  const createUserMutation = useMutation({
    mutationFn: (values: UserForm) =>
      Promise.resolve({
        id: Math.random().toString(),
        ...values,
      }),
    onSuccess: () => {
      message.success("Tạo người dùng thành công!");
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => {
        const color = USER_ROLE_COLORS[role];
        const text = USER_ROLE_LABELS[role];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Space>
          <Button type="link">Chỉnh sửa</Button>
          <Button type="link" danger>
            Xóa
          </Button>
          <Button type="link">Reset mật khẩu</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý người dùng"
      extra={
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm người dùng
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: TABLE_PAGE_SIZE }}
      />

      <Modal
        title="Thêm người dùng mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={createUserMutation.mutate}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Select.Option value={USER_ROLES.STUDENT}>
                {USER_ROLE_LABELS[USER_ROLES.STUDENT]}
              </Select.Option>
              <Select.Option value={USER_ROLES.LECTURER}>
                {USER_ROLE_LABELS[USER_ROLES.LECTURER]}
              </Select.Option>
              <Select.Option value={USER_ROLES.ADMIN}>
                {USER_ROLE_LABELS[USER_ROLES.ADMIN]}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createUserMutation.isPending}
              >
                Tạo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManagement;
