import {
  Modal,
  Descriptions,
  Avatar,
  Button,
  Form,
  Input,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useState } from "react";
import { resetPassword } from "@/services/api/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/api/profile";
interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [form] = Form.useForm();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const response = await getUserProfile(user?.userId);
        return response;
      } catch {
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin người dùng. Vui lòng thử lại sau!",
        });
        return null;
      }
    },
    enabled: !!token,
  });

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      if (!token) {
        notification.error({
          message: "Lỗi",
          description: "Token không hợp lệ!",
        });
        return;
      }
      await resetPassword(token, values.newPassword);
      notification.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công!",
      });
      setIsResetPasswordModalOpen(false);
      form.resetFields();
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Đổi mật khẩu thất bại, vui lòng thử lại!",
      });
    }
  };

  return (
    <>
      <Modal
        title="Thông tin người dùng"
        open={open}
        onCancel={onClose}
        footer={[
          <Button
            key="reset"
            type="primary"
            onClick={() => setIsResetPasswordModalOpen(true)}
          >
            Đổi mật khẩu
          </Button>,
          <Button key="edit" type="primary" onClick={onClose}>
            Sửa thông tin
          </Button>,
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {userProfile?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userProfile?.email}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        open={isResetPasswordModalOpen}
        onCancel={() => {
          setIsResetPasswordModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfileModal;
