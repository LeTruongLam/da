import { Card, Form, Input, Button, Select, Space, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";

interface SettingsForm {
  semester: string;
  academicYear: string;
  department: string;
  backupFrequency: string;
}

const SystemSettings = () => {
  const [form] = Form.useForm();

  // Fetch current settings
  const { data: currentSettings } = useQuery({
    queryKey: ["systemSettings"],
    queryFn: () => {
      // Replace with actual API call when available
      return Promise.resolve({
        semester: "2024.1",
        academicYear: "2023-2024",
        department: "cntt",
        backupFrequency: "daily",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (values: SettingsForm) => {
      // Replace with actual API call when available
      return Promise.resolve({
        success: true,
        data: values,
      });
    },
    onSuccess: () => {
      message.success("Cập nhật cài đặt thành công!");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  return (
    <Card title="Cài đặt hệ thống">
      <Form
        form={form}
        layout="vertical"
        onFinish={updateSettingsMutation.mutate}
        initialValues={
          currentSettings || {
            semester: "2024.1",
            academicYear: "2023-2024",
            department: "cntt",
            backupFrequency: "daily",
          }
        }
      >
        <Form.Item
          name="semester"
          label="Học kỳ hiện tại"
          rules={[{ required: true, message: "Vui lòng chọn học kỳ!" }]}
        >
          <Select>
            <Select.Option value="2024.1">Học kỳ 1 - 2024</Select.Option>
            <Select.Option value="2024.2">Học kỳ 2 - 2024</Select.Option>
            <Select.Option value="2024.3">Học kỳ hè - 2024</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="academicYear"
          label="Năm học"
          rules={[{ required: true, message: "Vui lòng nhập năm học!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="department"
          label="Khoa"
          rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
        >
          <Select>
            <Select.Option value="cntt">Công nghệ thông tin</Select.Option>
            <Select.Option value="dtvt">Điện tử viễn thông</Select.Option>
            <Select.Option value="dien">Điện</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="backupFrequency"
          label="Tần suất backup"
          rules={[
            { required: true, message: "Vui lòng chọn tần suất backup!" },
          ]}
        >
          <Select>
            <Select.Option value="daily">Hàng ngày</Select.Option>
            <Select.Option value="weekly">Hàng tuần</Select.Option>
            <Select.Option value="monthly">Hàng tháng</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateSettingsMutation.isPending}
            >
              Lưu cài đặt
            </Button>
            <Button onClick={() => form.resetFields()}>Đặt lại</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SystemSettings;
