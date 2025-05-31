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
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  TABLE_PAGE_SIZE,
} from "../../lib/constants";
import {
  getExternalLecturers,
  getInternalLecturers,
} from "@/services/api/teacher";
import { getStudents } from "@/services/api/student";

interface UserForm {
  email: string;
  name: string;
  role: string;
  password: string;
}

interface UserRecord {
  user_id: number;
  name: string;
  email: string;
  role_name: string;
  isRevoke: boolean;
}

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Query danh sách user từ 3 nguồn API
  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const [internalLecturers, externalLecturers, students] =
        await Promise.all([
          getInternalLecturers(),
          getExternalLecturers(),
          getStudents(),
        ]);
      return [...internalLecturers, ...externalLecturers, ...students];
    },
  });

  // Mutation tạo người dùng mới (demo)
  const createUserMutation = useMutation({
    mutationFn: (values: UserForm) =>
      Promise.resolve({
        user_id: Math.random(),
        ...values,
        role_name: USER_ROLE_LABELS[values.role] || values.role,
        isRevoke: false,
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

  // Mutation khóa tài khoản user (giả lập API PUT)
  const banUserMutation = useMutation({
    mutationFn: (userId: number) =>
      // Giả lập gọi API backend
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Ở đây bạn gọi API thực, ví dụ:
          // fetch(`/api/users/${userId}/ban`, { method: "PUT" })
          //   .then(...)
          // Giả lập thành công:
          resolve();
        }, 1000);
      }),
    onSuccess: () => {
      message.success("Khóa tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Khóa tài khoản thất bại!");
    },
  });

  // Hàm xử lý Khóa tài khoản
  const handleBanUser = (user: UserRecord) => {
    Modal.confirm({
      title: "Xác nhận Khóa tài khoản",
      content: `Bạn có chắc chắn muốn khóa tài khoản "${user.name}" không?`,
      okText: "Khóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => banUserMutation.mutate(user.user_id),
    });
  };

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
      dataIndex: "role_name",
      key: "role_name",
      render: (role: string) => {
        const color = USER_ROLE_COLORS[role] || "gray";
        const text = USER_ROLE_LABELS[role] || role;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: UserRecord) => (
        <Tag color={record.isRevoke ? "red" : "green"}>
          {record.isRevoke ? "Đã bị khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: UserRecord) => (
        <Button
          type="primary"
          danger
          onClick={() => handleBanUser(record)}
          disabled={record.isRevoke || banUserMutation.isPending}
        >
          {record.isRevoke ? "Đã bị khóa" : "Khóa tài khoản"}
        </Button>
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
        rowKey="user_id"
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
              <Select.Option value={USER_ROLES.INSIDE_LECTURER}>
                {USER_ROLE_LABELS[USER_ROLES.INSIDE_LECTURER]}
              </Select.Option>
              <Select.Option value={USER_ROLES.OUTSIDE_LECTURER}>
                {USER_ROLE_LABELS[USER_ROLES.OUTSIDE_LECTURER]}
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
                loading={createUserMutation.isLoading}
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
