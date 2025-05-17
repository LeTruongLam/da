import {
  Card,
  Form,
  Input,
  Button,
  Rate,
  DatePicker,
  Table,
  Pagination,
  message,
} from "antd";
import { useState } from "react";
import { StatusTag } from "@/components/ui";

const PAGE_SIZE = 5;

// Define types for our data
interface Evaluation {
  key: string;
  teacher: string;
  rating: number;
  comment: string;
  date: string;
}

interface Meeting {
  key: string;
  teacher: string;
  time: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

interface EvalFormValues {
  teacher: string;
  rating: number;
  comment: string;
}

interface MeetingFormValues {
  teacher: string;
  time: import("dayjs").Dayjs;
  reason: string;
}

// Mock lịch sử đánh giá
const mockEvaluations: Evaluation[] = Array.from({ length: 7 }).map((_, i) => ({
  key: String(i + 1),
  teacher: `TS. Giảng viên ${String.fromCharCode(65 + (i % 5))}`,
  rating: 3 + (i % 3),
  comment: `Nhận xét ${i + 1}`,
  date: `2024-06-${10 + i}`,
}));

// Mock lịch sử lịch họp
const mockMeetings: Meeting[] = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i + 1),
  teacher: `TS. Giảng viên ${String.fromCharCode(65 + (i % 5))}`,
  time: `2024-06-${12 + i} ${9 + (i % 3)}:00`,
  reason: `Lý do ${i + 1}`,
  status: i % 3 === 0 ? "pending" : "accepted",
}));

const EvaluateAndMeeting = () => {
  const [evalForm] = Form.useForm<EvalFormValues>();
  const [meetingForm] = Form.useForm<MeetingFormValues>();
  const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [evalPage, setEvalPage] = useState(1);
  const [meetingPage, setMeetingPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEvalFinish = (values: EvalFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setEvaluations([
        ...evaluations,
        {
          key: String(evaluations.length + 1),
          teacher: values.teacher,
          rating: values.rating,
          comment: values.comment,
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setLoading(false);
      evalForm.resetFields();
      message.success("Đánh giá thành công!");
    }, 1000);
  };

  const handleMeetingFinish = (values: MeetingFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setMeetings([
        ...meetings,
        {
          key: String(meetings.length + 1),
          teacher: values.teacher,
          time: values.time.format("YYYY-MM-DD HH:mm"),
          reason: values.reason,
          status: "pending",
        },
      ]);
      setLoading(false);
      meetingForm.resetFields();
      message.success("Đặt lịch họp thành công! Vui lòng chờ duyệt.");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Card title="Đánh giá giảng viên">
        <Form form={evalForm} layout="vertical" onFinish={handleEvalFinish}>
          <Form.Item
            name="teacher"
            label="Giảng viên"
            rules={[{ required: true, message: "Chọn giảng viên!" }]}
          >
            <Input placeholder="Nhập tên giảng viên" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: "Chọn số sao!" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét">
            <Input.TextArea rows={3} placeholder="Nhận xét về giảng viên..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
        <Card title="Lịch sử đánh giá" style={{ marginTop: 24 }}>
          <Table
            columns={[
              { title: "Giảng viên", dataIndex: "teacher", key: "teacher" },
              {
                title: "Số sao",
                dataIndex: "rating",
                key: "rating",
                render: (rating) => <Rate disabled defaultValue={rating} />,
              },
              { title: "Nhận xét", dataIndex: "comment", key: "comment" },
              { title: "Ngày", dataIndex: "date", key: "date" },
            ]}
            dataSource={paged(evaluations, evalPage)}
            pagination={false}
            scroll={{ y: 200 }}
          />
          <Pagination
            current={evalPage}
            pageSize={PAGE_SIZE}
            total={evaluations.length}
            onChange={setEvalPage}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        </Card>
      </Card>
      <Card title="Đặt lịch họp với giảng viên" style={{ marginTop: 32 }}>
        <Form
          form={meetingForm}
          layout="vertical"
          onFinish={handleMeetingFinish}
        >
          <Form.Item
            name="teacher"
            label="Giảng viên"
            rules={[{ required: true, message: "Chọn giảng viên!" }]}
          >
            <Input placeholder="Nhập tên giảng viên" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: "Chọn thời gian!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="reason" label="Lý do">
            <Input.TextArea rows={2} placeholder="Lý do họp..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đặt lịch họp
            </Button>
          </Form.Item>
        </Form>
        <Card title="Lịch sử đặt lịch họp" style={{ marginTop: 24 }}>
          <Table
            columns={[
              { title: "Giảng viên", dataIndex: "teacher", key: "teacher" },
              { title: "Thời gian", dataIndex: "time", key: "time" },
              { title: "Lý do", dataIndex: "reason", key: "reason" },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                render: (status: "pending" | "accepted" | "rejected") => (
                  <StatusTag type="task" status={status} />
                ),
              },
            ]}
            dataSource={paged(meetings, meetingPage)}
            pagination={false}
            scroll={{ y: 200 }}
          />
          <Pagination
            current={meetingPage}
            pageSize={PAGE_SIZE}
            total={meetings.length}
            onChange={setMeetingPage}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default EvaluateAndMeeting;
