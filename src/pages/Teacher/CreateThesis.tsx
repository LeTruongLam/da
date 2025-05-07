import { Card, Form, Input, Button, DatePicker, Select, message } from "antd";
import { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

// Mock chuyên ngành
const majors = [
  { value: "cntt", label: "Công nghệ thông tin" },
  { value: "ktpm", label: "Kỹ thuật phần mềm" },
  { value: "httt", label: "Hệ thống thông tin" },
];

interface FormValues {
  title: string;
  major: string;
  deadline: dayjs.Dayjs;
  description?: string;
  requirements?: string;
  objectives?: string;
  subTasks?: Array<{
    name: string;
    startDate: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
    description?: string;
  }>;
}

const CreateThesis = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: FormValues) => {
    setLoading(true);
    console.log("Creating thesis with values:", values);
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
      message.success("Tạo đề tài thành công!");
    }, 1000);
  };

  return (
    <Card title="Tạo mới đề tài" style={{ maxWidth: 900, margin: "0 auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" />
        </Form.Item>
        <Form.Item
          name="major"
          label="Chuyên ngành"
          rules={[{ required: true, message: "Chọn chuyên ngành!" }]}
        >
          <Select options={majors} placeholder="Chọn chuyên ngành" />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: "Chọn deadline!" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả đề tài">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết đề tài..." />
        </Form.Item>
        <Form.Item name="requirements" label="Yêu cầu">
          <Input.TextArea rows={2} placeholder="Yêu cầu của đề tài..." />
        </Form.Item>
        <Form.Item name="objectives" label="Mục tiêu">
          <Input.TextArea rows={2} placeholder="Mục tiêu của đề tài..." />
        </Form.Item>
        <Form.List name="subTasks">
          {(fields, { add, remove }) => (
            <>
              <label>
                <b>Các công việc (sub-task)</b>
              </label>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: 16,
                    gap: 8,
                  }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Tên công việc"
                    rules={[{ required: true, message: "Nhập tên công việc!" }]}
                    style={{ flex: "1 1 200px", marginBottom: 0 }}
                  >
                    <Input placeholder="Tên công việc" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "startDate"]}
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
                    style={{ flex: "1 1 150px", marginBottom: 0 }}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "deadline"]}
                    label="Deadline"
                    rules={[{ required: true, message: "Chọn deadline!" }]}
                    style={{ flex: "1 1 150px", marginBottom: 0 }}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Mô tả"
                    style={{ flex: "1 1 300px", marginBottom: 0 }}
                  >
                    <Input.TextArea placeholder="Mô tả công việc" rows={1} />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                    style={{ marginTop: 30 }}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Thêm công việc
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo đề tài
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateThesis;
