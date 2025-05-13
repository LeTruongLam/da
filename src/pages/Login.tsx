import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Space,
  message,
  Divider,
  List,
} from "antd";
import { useDispatch } from "react-redux";
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../store/slices/authSlice";
import { useState } from "react";
import { login } from "../services/api/auth";
import { USER_ROLES } from "../lib/constants";

const { Title, Text } = Typography;

const demoAccounts = [
  {
    role: USER_ROLES.STUDENT,
    email: "PhucNVHE171648@fpt.edu.vn",
    password: "PhucNVHE171648",
  },
  {
    role: USER_ROLES.LECTURER,
    email: "truonglam962002@gmail.com",
    password: "q-uL39oQ?N",
  },
  {
    role: USER_ROLES.ADMIN,
    email: "admin@fpt.edu.vn",
    password: "Admin@123",
  },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const result = await login(values);

      // Dispatch credentials to Redux store
      dispatch(
        setCredentials({
          user: { ...result.user, userId: Number(result.user.userId) },
          token: result.token,
          expiresIn: result.expiresIn,
        })
      );

      message.success(`Xin chào, ${result.user.name}!`);
      navigate("/", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error("Đăng nhập thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const fillLoginForm = (email: string, password: string) => {
    form.setFieldsValue({
      email,
      password,
    });
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
            Thesis Management
          </Title>
          <Form
            form={form}
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
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
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Button type="link" onClick={() => navigate("/forgot-password")}>
                Quên mật khẩu?
              </Button>
              <Button type="link" onClick={() => navigate("/register")}>
                Chưa có tài khoản? Đăng ký
              </Button>
            </div>
          </Form>

          <Divider>
            <InfoCircleOutlined /> Tài khoản demo
          </Divider>

          <List
            size="small"
            bordered
            dataSource={demoAccounts}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => fillLoginForm(item.email, item.password)}
                  >
                    Sử dụng
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{item.role}</Text>}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text>Email: {item.email}</Text>
                      <Text>Mật khẩu: {item.password}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Login;
