import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Table,
  Tag,
  Spin,
  Empty,
} from "antd";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Updated Teacher interface without references to Lecturer
interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  expertise: string;
  major: string;
}

interface Topic {
  id: string;
  title: string;
}

interface Request {
  key: string;
  topic: string;
  teacher: string;
  status: "pending" | "accepted" | "rejected";
}

interface RequestFormValues {
  topic: string;
  teacher: string;
  note?: string;
}

const statusMap = {
  pending: { color: "orange", text: "Chờ duyệt" },
  accepted: { color: "green", text: "Đã duyệt" },
  rejected: { color: "red", text: "Từ chối" },
};

const RequestMentor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch teachers with mock data
  const { data: teachers = [], isLoading: teachersLoading } = useQuery<
    Teacher[]
  >({
    queryKey: ["teachers"],
    queryFn: async () => {
      // Replaced with mock data instead of API call
      return Promise.resolve<Teacher[]>([
        {
          id: "1",
          name: "TS. Nguyễn Văn A",
          email: "nguyenvana@example.edu.vn",
          phone: "0987654321",
          department: "Công nghệ thông tin",
          expertise: "Trí tuệ nhân tạo, Học máy",
          major: "Công nghệ thông tin",
        },
        {
          id: "2",
          name: "TS. Trần Thị B",
          email: "tranthib@example.edu.vn",
          phone: "0987654322",
          department: "Khoa học máy tính",
          expertise: "IoT, Edge Computing",
          major: "Khoa học máy tính",
        },
        {
          id: "3",
          name: "TS. Lê Minh C",
          email: "leminhc@example.edu.vn",
          phone: "0987654323",
          department: "Kỹ thuật phần mềm",
          expertise: "An toàn thông tin, Blockchain",
          major: "Kỹ thuật phần mềm",
        },
      ]);
    },
  });

  // Fetch topics
  const { data: topics = [], isLoading: topicsLoading } = useQuery<Topic[]>({
    queryKey: ["topics"],
    queryFn: () => {
      // Replace with mock data
      return Promise.resolve<Topic[]>([
        { id: "1", title: "Đề tài 1: Ứng dụng công nghệ mới trong giáo dục" },
        { id: "2", title: "Đề tài 2: Phát triển ứng dụng web hiện đại" },
        { id: "3", title: "Đề tài 3: Xây dựng hệ thống quản lý học tập" },
      ]);
    },
  });

  // Fetch user requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery<
    Request[]
  >({
    queryKey: ["mentor-requests"],
    queryFn: () => {
      // Replace with mock data
      return Promise.resolve<Request[]>([
        {
          key: "1",
          topic: "Đề tài 1: Ứng dụng công nghệ mới trong giáo dục",
          teacher: "TS. Nguyễn Văn A",
          status: "pending",
        },
      ]);
    },
  });

  // Submit request mutation
  const submitRequestMutation = useMutation({
    mutationFn: (formData: RequestFormValues) => {
      // Replace with mock API call
      return new Promise<void>((resolve) => {
        console.log("Sending form data:", formData);
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onSuccess: () => {
      message.success("Gửi yêu cầu thành công! Vui lòng chờ giảng viên duyệt.");
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["mentor-requests"] });
    },
    onError: (error: Error) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });

  const onFinish = (values: RequestFormValues) => {
    setLoading(true);
    submitRequestMutation.mutate(values);
  };

  if (teachersLoading || topicsLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

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
            {topics.map((topic: Topic) => (
              <Select.Option key={topic.id} value={topic.id}>
                {topic.title}
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
            {teachers.map((teacher: Teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.name} (
                {teacher.major || teacher.department || "Không có thông tin"})
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
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || submitRequestMutation.isPending}
            block
          >
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>

      <Card title="Yêu cầu đã gửi" style={{ marginTop: 32 }}>
        {requestsLoading ? (
          <Spin tip="Đang tải dữ liệu..." />
        ) : requests.length > 0 ? (
          <Table
            columns={[
              { title: "Đề tài", dataIndex: "topic", key: "topic" },
              { title: "Giảng viên", dataIndex: "teacher", key: "teacher" },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (status: "pending" | "accepted" | "rejected") => (
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
        ) : (
          <Empty description="Bạn chưa gửi yêu cầu nào" />
        )}
      </Card>
    </Card>
  );
};

export default RequestMentor;
