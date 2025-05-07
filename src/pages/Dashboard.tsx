import { Card, Table, Tag } from "antd";
import { CalendarOutlined, BellOutlined } from "@ant-design/icons";
import { tasks, meetings, notifications } from "../mocks/dashboardData";

const Dashboard = () => {
  const taskColumns = [
    { title: "Tên công việc", dataIndex: "name", key: "name" },
    { title: "Đề tài", dataIndex: "project", key: "project" },
    { title: "Sinh viên", dataIndex: "student", key: "student" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Hoàn thành" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    { title: "Hạn chót", dataIndex: "due", key: "due" },
  ];

  const meetingColumns = [
    { title: "Thời gian", dataIndex: "time", key: "time" },
    { title: "Sinh viên", dataIndex: "student", key: "student" },
    { title: "Mentor", dataIndex: "mentor", key: "mentor" },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Tham gia
        </a>
      ),
    },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];

  const notificationColumns = [
    { title: "Nội dung", dataIndex: "message", key: "message" },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          icon={type === "meeting" ? <CalendarOutlined /> : <BellOutlined />}
        >
          {type}
        </Tag>
      ),
    },
    { title: "Thời gian gửi", dataIndex: "sent", key: "sent" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "unread" ? "red" : "default"}>
          {status === "unread" ? "Chưa đọc" : "Đã đọc"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      <Card title="Công việc gần deadline" style={{ marginTop: 24 }}>
        <Table columns={taskColumns} dataSource={tasks} pagination={false} />
      </Card>

      <Card title="Lịch họp sắp tới" style={{ marginTop: 24 }}>
        <Table
          columns={meetingColumns}
          dataSource={meetings}
          pagination={false}
        />
      </Card>

      <Card title="Thông báo mới nhất" style={{ marginTop: 24 }}>
        <Table
          columns={notificationColumns}
          dataSource={notifications}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
