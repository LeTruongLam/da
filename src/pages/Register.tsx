import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  message,
  Select,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { register } from "@/services/api/auth";
import { useQuery } from "@tanstack/react-query";
import { getMajors } from "@/services/api/major";

const { Title } = Typography;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  majorId: number;
}

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: majors = [], isLoading: isLoadingMajors } = useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
  });

  const onFinish = async (values: RegisterFormData) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        majorId: values.majorId,
      });
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
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
            Đăng ký tài khoản
          </Title>
          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            style={{ textAlign: "left" }}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>

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

            <Form.Item
              name="majorId"
              label="Chuyên ngành"
              rules={[
                { required: true, message: "Vui lòng chọn chuyên ngành!" },
              ]}
            >
              <Select
                placeholder="Chọn chuyên ngành"
                loading={isLoadingMajors}
                options={majors.map((major) => ({
                  label: major.majorName,
                  value: major.majorId,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" size="large" block>
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button type="link" onClick={() => navigate("/login")}>
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
