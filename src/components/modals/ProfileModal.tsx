import { Modal, Descriptions, Button, Form, Input, notification } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useState } from "react";
import { getUserById, resetPassword } from "@/services/api/auth";
import { USER_ROLES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [form] = Form.useForm();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!user) {
        return null;
      }
      try {
        const response = await getUserById(user.user_id);
        return response;
      } catch {
        console.error("Error fetching user profile");
      }
    },
    enabled: !!token && !!user && user.role_name !== USER_ROLES.ADMIN,
  });

  if (!user || user.role_name === USER_ROLES.ADMIN) {
    return null;
  }

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      setIsResettingPassword(true);
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
    } finally {
      setIsResettingPassword(false);
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
            loading={isResettingPassword}
          >
            Đổi mật khẩu
          </Button>,
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {userProfile?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userProfile?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Mã số">
            {userProfile?.code}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        open={isResetPasswordModalOpen}
        onCancel={() => {
          if (isResettingPassword) return; // Prevent closing while submitting
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
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isResettingPassword}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfileModal;
