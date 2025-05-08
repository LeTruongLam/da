import { Card, Table, Tag, Button, Progress, Pagination, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";

// Giả lập dữ liệu đồ án
const mockTheses = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i + 1),
  title: `Đề tài nghiên cứu về ${
    i % 3 === 0 ? "AI" : i % 3 === 1 ? "Blockchain" : "IoT"
  } trong ${i % 2 === 0 ? "giáo dục" : "y tế"}`,
  student:
    i < 5
      ? {
          id: `SV${i + 100}`,
          name: `Sinh viên ${String.fromCharCode(65 + i)}`,
          email: `sv${String.fromCharCode(97 + i)}@example.com`,
        }
      : null,
  status:
    i % 4 === 0
      ? "pending"
      : i % 4 === 1
      ? "in_progress"
      : i % 4 === 2
      ? "delayed"
      : "completed",
  progress: i % 4 === 3 ? 100 : 25 * (i % 4),
  deadline: `2024-${7 + Math.floor(i / 5)}-${15 + (i % 15)}`,
  created_at: `2024-03-${10 + (i % 20)}`,
  description: `Mô tả chi tiết về đề tài nghiên cứu ${
    i + 1
  }. Bao gồm các nội dung chính và phương pháp thực hiện.`,
}));

interface ThesisRecord {
  id: string;
  title: string;
  student: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: string;
  progress: number;
  deadline: string;
  created_at: string;
  description: string;
}

const ThesisManagement = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Sinh viên",
      dataIndex: "student",
      key: "student",
      render: (student: ThesisRecord["student"]) =>
        student ? (
          <span>
            <UserOutlined /> {student.name}
          </span>
        ) : (
          "--"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Chờ duyệt", value: "pending" },
        { text: "Đang thực hiện", value: "in_progress" },
        { text: "Trễ hạn", value: "delayed" },
        { text: "Hoàn thành", value: "completed" },
      ],
      onFilter: (value: string | number | boolean, record: ThesisRecord) =>
        record.status === value,
      render: (status: string) => {
        const statusMap = {
          pending: { color: "default", text: "Chờ duyệt" },
          in_progress: { color: "processing", text: "Đang thực hiện" },
          delayed: { color: "error", text: "Trễ hạn" },
          completed: { color: "success", text: "Hoàn thành" },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Progress
          percent={progress}
          size="small"
          status={
            progress === 100
              ? "success"
              : progress < 25
              ? "exception"
              : "active"
          }
        />
      ),
      sorter: (a: ThesisRecord, b: ThesisRecord) => a.progress - b.progress,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a: ThesisRecord, b: ThesisRecord) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: ThesisRecord) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/thesis-detail/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Phân trang cho dữ liệu
  const paginatedData = mockTheses.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <>
      <Card
        title="Quản lý đồ án"
        extra={
          <Button type="primary" onClick={() => navigate("/create-thesis")}>
            Tạo mới đề tài
          </Button>
        }
      >
        <Alert
          message="Lưu ý: Mỗi đề tài chỉ được phép gán cho một sinh viên"
          description="Nếu đề tài đã có sinh viên đăng ký, bạn không thể thêm sinh viên khác vào đề tài này."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
        <Pagination
          current={current}
          pageSize={pageSize}
          total={mockTheses.length}
          onChange={(page) => setCurrent(page)}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrent(current);
          }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} đề tài`}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </>
  );
};

export default ThesisManagement;
