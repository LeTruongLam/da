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
import { api } from "../services/api";
import { setCredentials } from "../store/slices/authSlice";
import { useState } from "react";

const { Title, Text } = Typography;

const demoAccounts = [
  {
    role: "Sinh viên",
    email: "student@example.edu.vn",
    password: "password",
  },
  {
    role: "Giảng viên",
    email: "teacher@example.edu.vn",
    password: "password",
  },
  {
    role: "Admin",
    email: "admin@example.edu.vn",
    password: "password",
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
      const user = await api.login(values.email, values.password);
      dispatch(setCredentials({ user, token: "mock-token" }));
      message.success(`Xin chào, ${user.name}!`);
      navigate("/", { replace: true });
    } catch {
      message.error("Email hoặc mật khẩu không đúng");
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
