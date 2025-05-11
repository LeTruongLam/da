import { Button, Card, Form, Input, Typography, Space, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "@/services/api/auth";

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      await forgotPassword(values.email);
      message.success("Vui lòng kiểm tra email của bạn để đặt lại mật khẩu!");
      navigate("/login");
    } catch (error) {
      message.error("Không thể gửi email đặt lại mật khẩu, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{ width: 450, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        bordered={false}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Quên mật khẩu
          </Title>
          <Form
            form={form}
            name="forgot-password"
            layout="vertical"
            onFinish={handleSubmit}
            style={{ textAlign: "left" }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>

          <Button type="link" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ForgotPassword;
