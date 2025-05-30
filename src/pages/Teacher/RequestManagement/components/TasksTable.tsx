import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Form,
  Modal,
  Input,
  DatePicker,
  message,
} from "antd";
import {
  FileTextOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import { useState } from "react";
import dayjs from "dayjs";
import type { RequestDetailResponse } from "@/services/api/request";
import { useMutation } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  type CreateTaskRequest,
} from "@/services/api/task";
import TextArea from "antd/es/input/TextArea";

interface TasksTableProps {
  requestData: RequestDetailResponse | undefined | null;
  refetch: () => void;
}
type TaskType = {
  task_id: number;
  task_name: string;
  status: string;
  due_date: string;
  num_Submit: number;
};
const TasksTable: React.FC<TasksTableProps> = ({ requestData, refetch }) => {
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);

  const [form] = Form.useForm();

  const { mutate: createTaskMution } = useMutation({
    mutationFn: (values: CreateTaskRequest) => createTask(values),
    onSuccess: () => {
      message.success("Tạo công việc thanh cong!");
      setIsSubtaskModalVisible(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
      message.error("Tạo công việc thất bại!");
      setIsSubtaskModalVisible(false);
    },
  });

  const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      refetch();
      message.success("Xóa công việc thành công!");
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
      message.error("Xóa công việc thất bại!");
    },
  });

  const onAddTask = () => {
    setIsSubtaskModalVisible(true);
  };

  const onSubmit = () => {
    createTaskMution({
      ...form.getFieldsValue(),
      request_id: requestData?.request_id,
    });
  };

  const handleDeleteTask = (record: TaskType) => {
    deleteTaskMutation(record.task_id);
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "due_date",
      key: "due_date",
      render: (deadline: string) => (
        <span>{dayjs(deadline).format("DD/MM/YYYY HH:mm")}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag>{TASK_STATUS_LABELS[status] || status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record: TaskType) => (
        <Space>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            loading={isDeleting}
            onClick={() => {
              handleDeleteTask(record);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Các công việc"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
            Thêm công việc
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={requestData?.tasks || []}
          pagination={false}
          rowKey="key"
        />
      </Card>
      <Modal
        title={"Thêm công việc mới"}
        open={isSubtaskModalVisible}
        onCancel={() => {
          setIsSubtaskModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={"Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="task_name"
            label="Tên công việc"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả công việc" },
            ]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chi tiết về công việc" />
          </Form.Item>

          <Form.Item
            name="due_date"
            label="Deadline"
            rules={[{ required: true, message: "Vui lòng chọn deadline" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TasksTable;
