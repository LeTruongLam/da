import {
  Modal,
  Descriptions,
  Avatar,
  Button,
  Form,
  Input,
  notification,
  Switch,
  Tag,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useState } from "react";
import { resetPassword } from "@/services/api/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/services/api/profile";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // const { data: userProfile } = useQuery({
  //   queryKey: ["userProfile"],
  //   queryFn: async () => {
  //     if (!user) {
  //       return null;
  //     }
  //     try {
  //       const response = await getUserProfile(user.user_id);
  //       return response;
  //     } catch {
  //       notification.error({
  //         message: "Lỗi",
  //         description:
  //           "Không thể tải thông tin người dùng. Vui lòng thử lại sau!",
  //       });
  //     }
  //   },
  //   enabled: !!token,
  // });

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

  const handleEditProfile = async (values: {
    name: string;
    majorId: number;
    isNotificationsEnabled: boolean;
  }) => {
    try {
      setIsEditingProfile(true);
      await updateUserProfile({
        name: values.name,
        majorId: values.majorId,
        isNotificationsEnabled: values.isNotificationsEnabled,
      });
      // Refresh userProfile data
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      notification.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công!",
      });
      setIsEditProfileModalOpen(false);
      editForm.resetFields();
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật thông tin thất bại, vui lòng thử lại!",
      });
    } finally {
      setIsEditingProfile(false);
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
            disabled={isEditingProfile}
          >
            Đổi mật khẩu
          </Button>,
          <Button
            key="edit"
            type="primary"
            // onClick={() => {
            //   setIsEditProfileModalOpen(true);
            //   editForm.setFieldsValue({
            //     name: userProfile?.name,
            //     majorId: userProfile?.major.majorId,
            //     isNotificationsEnabled: userProfile?.isNotificationsEnabled,
            //   });
            // }}
            loading={isEditingProfile}
            disabled={isResettingPassword}
          >
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
        {/* <Descriptions bordered column={1}>
          <Descriptions.Item label="Họ và tên">
            {userProfile?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userProfile?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Chuyên ngành">
            {userProfile?.major.majorName}
          </Descriptions.Item>
          <Descriptions.Item label="Cài đặt thông báo">
            {userProfile?.isNotificationsEnabled ? (
              <Tag color="success">Đã bật</Tag>
            ) : (
              <Tag color="error">Đã tắt</Tag>
            )}
          </Descriptions.Item>
        </Descriptions> */}
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

      <Modal
        title="Sửa thông tin"
        open={isEditProfileModalOpen}
        onCancel={() => {
          if (isEditingProfile) return;
          setIsEditProfileModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditProfile}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isNotificationsEnabled"
            label="Cài đặt thông báo"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isEditingProfile}
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
