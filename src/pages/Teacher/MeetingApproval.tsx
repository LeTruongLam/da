import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  DatePicker,
  Card,
  Tabs,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

// Define the Meeting type here to match what's in the API
interface Meeting {
  id: string;
  title: string;
  purpose: string;
  date: string;
  time: string;
  thesisId: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  link?: string;
  notes?: string;
}

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface UpdateMeetingValues {
  id: string;
  status: Meeting["status"];
  feedback: string;
  scheduledDate?: Date;
  link?: string;
}

const MeetingApproval = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch meeting requests
  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: api.getMeetingRequests,
  });

  // Update meeting status mutation
  const updateMeetingMutation = useMutation({
    mutationFn: (values: UpdateMeetingValues) =>
      api.updateMeetingStatus(values.id, values.status, values.link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      message.success("Cập nhật trạng thái cuộc họp thành công!");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const handleApprove = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    form.setFieldsValue({
      id: meeting.id,
      status: "approved",
      feedback: "",
    });
    setIsModalVisible(true);
  };

  const handleReject = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    form.setFieldsValue({
      id: meeting.id,
      status: "rejected",
      feedback: "",
    });
    setIsModalVisible(true);
  };

  const handleComplete = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    form.setFieldsValue({
      id: meeting.id,
      status: "completed",
      feedback: "",
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values: UpdateMeetingValues) => {
    updateMeetingMutation.mutate(values);
  };

  const pendingMeetings = meetings.filter((m) => m.status === "pending");
  const approvedMeetings = meetings.filter((m) => m.status === "approved");
  const completedMeetings = meetings.filter((m) => m.status === "completed");
  const rejectedMeetings = meetings.filter((m) => m.status === "rejected");

  const columns = [
    {
      title: "Sinh viên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Đề tài",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thời gian yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
    },
    {
      title: "Lý do",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Meeting["status"]) => {
        const statusConfig = {
          pending: { color: "blue", text: "Chờ duyệt" },
          approved: { color: "green", text: "Đã duyệt" },
          rejected: { color: "red", text: "Từ chối" },
          completed: { color: "purple", text: "Hoàn thành" },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Meeting) => (
        <Space size="small">
          {record.status === "pending" && (
            <>
              <Button type="primary" onClick={() => handleApprove(record)}>
                Chấp nhận
              </Button>
              <Button danger onClick={() => handleReject(record)}>
                Từ chối
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button type="primary" onClick={() => handleComplete(record)}>
              Đánh dấu hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý lịch hẹn</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
        Quản lý các yêu cầu lịch hẹn từ sinh viên
      </Text>

      <Tabs defaultActiveKey="pending">
        <TabPane tab={`Chờ duyệt (${pendingMeetings.length})`} key="pending">
          <Card>
            <Table
              columns={columns}
              dataSource={pendingMeetings}
              rowKey="id"
              loading={isLoading}
            />
          </Card>
        </TabPane>

        <TabPane tab={`Đã duyệt (${approvedMeetings.length})`} key="approved">
          <Card>
            <Table
              columns={columns}
              dataSource={approvedMeetings}
              rowKey="id"
              loading={isLoading}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={`Hoàn thành (${completedMeetings.length})`}
          key="completed"
        >
          <Card>
            <Table
              columns={columns}
              dataSource={completedMeetings}
              rowKey="id"
              loading={isLoading}
            />
          </Card>
        </TabPane>

        <TabPane tab={`Từ chối (${rejectedMeetings.length})`} key="rejected">
          <Card>
            <Table
              columns={columns}
              dataSource={rejectedMeetings}
              rowKey="id"
              loading={isLoading}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={
          selectedMeeting?.status === "pending"
            ? selectedMeeting && form.getFieldValue("status") === "approved"
              ? "Chấp nhận yêu cầu"
              : "Từ chối yêu cầu"
            : "Đánh dấu hoàn thành cuộc họp"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>

          {form.getFieldValue("status") === "approved" && (
            <>
              <Form.Item
                name="scheduledDate"
                label="Chọn thời gian họp"
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian họp" },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="link"
                label="Link cuộc họp"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng cung cấp link cuộc họp",
                  },
                ]}
              >
                <Input placeholder="https://meet.google.com/..." />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="feedback"
            label="Phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập phản hồi" }]}
          >
            <TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMeetingMutation.isPending}
            >
              {form.getFieldValue("status") === "approved"
                ? "Chấp nhận"
                : form.getFieldValue("status") === "rejected"
                ? "Từ chối"
                : "Hoàn thành"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MeetingApproval;
