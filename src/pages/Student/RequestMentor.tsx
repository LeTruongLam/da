import { Card, Form, Input, Button, Select, message, Table, Tag } from "antd";
import { useState } from "react";

// Mock data giảng viên và đề tài
const teachers = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  name: `TS. Giảng viên ${String.fromCharCode(65 + i)}`,
  major: i % 2 === 0 ? "CNTT" : "Kỹ thuật phần mềm",
}));
const topics = Array.from({ length: 10 }).map((_, i) => ({
  id: String(i + 1),
  title: `Đề tài số ${i + 1}: Ứng dụng công nghệ mới trong giáo dục`,
}));

// Mock danh sách yêu cầu đã gửi
const mockRequests = [
  {
    key: "1",
    topic: "Đề tài số 1: Ứng dụng công nghệ mới trong giáo dục",
    teacher: "TS. Giảng viên A",
    status: "pending",
  },
  {
    key: "2",
    topic: "Đề tài số 2: Ứng dụng công nghệ mới trong giáo dục",
    teacher: "TS. Giảng viên B",
    status: "accepted",
  },
];

const statusMap = {
  pending: { color: "orange", text: "Chờ duyệt" },
  accepted: { color: "green", text: "Đã duyệt" },
  rejected: { color: "red", text: "Từ chối" },
};

const RequestMentor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(mockRequests);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setRequests([
        ...requests,
        {
          key: String(requests.length + 1),
          topic: topics.find((t) => t.id === values.topic)?.title,
          teacher: teachers.find((t) => t.id === values.teacher)?.name,
          status: "pending",
        },
      ]);
      setLoading(false);
      form.resetFields();
      message.success("Gửi yêu cầu thành công! Vui lòng chờ giảng viên duyệt.");
    }, 1000);
  };

  return (
    <Card
      title="Gửi yêu cầu chọn giảng viên hướng dẫn"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="topic"
          label="Chọn đề tài"
          rules={[{ required: true, message: "Vui lòng chọn đề tài!" }]}
        >
          <Select placeholder="Chọn đề tài">
            {topics.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="teacher"
          label="Chọn giảng viên hướng dẫn"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
        >
          <Select placeholder="Chọn giảng viên">
            {teachers.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.name} ({t.major})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="note" label="Ghi chú (tuỳ chọn)">
          <Input.TextArea
            rows={3}
            placeholder="Bạn có thể gửi lời nhắn cho giảng viên..."
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>

      <Card title="Yêu cầu đã gửi" style={{ marginTop: 32 }}>
        <Table
          columns={[
            { title: "Đề tài", dataIndex: "topic", key: "topic" },
            { title: "Giảng viên", dataIndex: "teacher", key: "teacher" },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status) => (
                <Tag color={statusMap[status].color}>
                  {statusMap[status].text}
                </Tag>
              ),
            },
          ]}
          dataSource={requests}
          pagination={false}
          scroll={{ y: 200 }}
        />
      </Card>
    </Card>
  );
};

export default RequestMentor;
