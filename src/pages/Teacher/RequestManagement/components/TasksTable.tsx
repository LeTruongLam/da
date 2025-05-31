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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import type { RequestDetailResponse } from "@/services/api/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  updateTask,
  getTaskDetail,
  type CreateTaskRequest,
  type UpdateTaskRequest,
} from "@/services/api/task";
import TextArea from "antd/es/input/TextArea";

interface TasksTableProps {
  requestData: RequestDetailResponse | undefined | null;
  refetch: () => void;
}

type TaskType = {
  task_id: number;
  task_name: string;
  description?: string;
  status: string;
  due_date: string;
  num_Submit: number;
};

const TasksTable: React.FC<TasksTableProps> = ({ requestData, refetch }) => {
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  const [form] = Form.useForm();

  const { data: taskDetail, refetch: refetchTaskDetail } = useQuery({
    queryKey: ["taskDetail", editingTask?.task_id],
    queryFn: () => getTaskDetail(editingTask!.task_id),
    enabled: !!editingTask?.task_id,
  });

  const { mutate: createTaskMutation } = useMutation({
    mutationFn: (values: CreateTaskRequest) => createTask(values),
    onSuccess: () => {
      message.success("Tạo công việc thành công!");
      setIsSubtaskModalVisible(false);
      form.resetFields();
      refetch();
    },
    onError: (error) => {
      console.error("Tạo thất bại:", error);
      message.error("Tạo công việc thất bại!");
      setIsSubtaskModalVisible(false);
    },
  });

  const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: number;
      data: UpdateTaskRequest;
    }) => updateTask(taskId, data),
    onSuccess: () => {
      message.success("Cập nhật công việc thành công!");
      setIsSubtaskModalVisible(false);
      setEditingTask(null);
      form.resetFields();
      refetch();
      refetchTaskDetail();
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
      message.error("Cập nhật công việc thất bại!");
    },
  });

  const { mutate: deleteTaskMutation, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      refetch();
      message.success("Xóa công việc thành công!");
    },
    onError: (error) => {
      console.error("Xóa thất bại:", error);
      message.error("Xóa công việc thất bại!");
    },
  });

  const onAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setIsSubtaskModalVisible(true);
  };

  const onSubmit = () => {
    const values = form.getFieldsValue();
    const payload = {
      ...values,
      due_date: values.due_date?.toISOString(),
      request_id: requestData?.request_id,
    };

    if (editingTask) {
      updateTaskMutation({
        taskId: editingTask.task_id,
        data: payload,
      });
    } else {
      createTaskMutation(payload);
    }
  };

  const handleDeleteTask = (record: TaskType) => {
    deleteTaskMutation(record.task_id);
  };

  const handleEditTask = (record: TaskType) => {
    setEditingTask(record);
    setIsSubtaskModalVisible(true);
  };

  // Update form values when taskDetail is loaded
  useEffect(() => {
    if (taskDetail) {
      form.setFieldsValue({
        task_name: taskDetail.task_name,
        description: taskDetail.description,
        due_date: dayjs(taskDetail.due_date),
      });
    }
  }, [taskDetail, form]);

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
      width: 200,
      render: (deadline: string) => (
        <span>{dayjs(deadline).format("DD/MM/YYYY HH:mm")}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (status: string) => (
        <Tag>{TASK_STATUS_LABELS[status] || status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: any, record: TaskType) => (
        <Space>
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => handleEditTask(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            loading={isDeleting}
            onClick={() => handleDeleteTask(record)}
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
          rowKey={(record: TaskType) => record.task_id.toString()}
        />
      </Card>

      <Modal
        title={editingTask ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
        open={isSubtaskModalVisible}
        onCancel={() => {
          setIsSubtaskModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingTask ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        confirmLoading={isUpdating}
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
