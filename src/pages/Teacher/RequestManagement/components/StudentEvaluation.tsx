import {
  Card,
  Space,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Select,
} from "antd";
import {
  CommentOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTasksByRequest,
  getTaskDetail,
  updateTask,
  type TaskResponse,
  type TaskDetailResponse,
} from "@/services/api/task";
import { TASK_STATUS, TASK_STATUS_LABELS } from "@/lib/constants";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useParams } from "react-router-dom";
import { addFeedback } from "@/services/api/feedback";

const EvaluationModal = ({
  visible,
  task,
  taskDetail,
  onCancel,
  onSubmit,
  loading,
}: {
  visible: boolean;
  task: TaskResponse | null;
  taskDetail: TaskDetailResponse | undefined;
  onCancel: () => void;
  onSubmit: (values: { status: string; comment: string }) => void;
  loading: boolean;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (taskDetail) {
      form.setFieldsValue({
        status: taskDetail.status,
        comment: taskDetail.comment,
      });
    }
  }, [taskDetail, form]);

  return (
    <Modal
      title={`Đánh giá: ${task?.task_name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      {taskDetail && (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value={TASK_STATUS.DONE}>Hoàn thành</Select.Option>
              <Select.Option value={TASK_STATUS.IN_PROGRESS}>
                Đang thực hiện
              </Select.Option>
              <Select.Option value={TASK_STATUS.TO_DO}>
                Chờ thực hiện
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Lưu đánh giá
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

const StudentEvaluation: React.FC<{ refetch: () => void }> = ({ refetch }) => {
  const { id: requestId } = useParams();
  const [isEvaluationModalVisible, setIsEvaluationModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasksByRequest", requestId],
    queryFn: () => {
      if (!requestId) return null;
      return getTasksByRequest(Number(requestId));
    },
    enabled: !!requestId,
  });

  const { data: taskDetail, refetch: refetchTaskDetail } = useQuery({
    queryKey: ["taskDetail", selectedTask?.task_id],
    queryFn: () => getTaskDetail(selectedTask!.task_id),
    enabled: !!selectedTask?.task_id,
  });

  const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: number;
      data: Partial<TaskDetailResponse>;
    }) => updateTask(taskId, data),
  });

  const { mutate: createFeedbackMutation } = useMutation({
    mutationFn: ({ taskId, comment }: { taskId: number; comment: string }) =>
      addFeedback({ task_id: taskId, comment }),
  });

  const openEvaluationModal = (task: TaskResponse) => {
    setSelectedTask(task);
    setIsEvaluationModalVisible(true);
  };

  const closeModal = () => {
    setIsEvaluationModalVisible(false);
    setSelectedTask(null);
  };

  const handleEvaluate = async (values: {
    status: string;
    comment: string;
  }) => {
    if (!selectedTask) return;
    try {
      await updateTaskMutation({
        taskId: selectedTask.task_id,
        data: {
          status: values.status,
          due_date: selectedTask.due_date,
        },
      });

      await createFeedbackMutation({
        taskId: selectedTask.task_id,
        comment: values.comment,
      });
      closeModal();
      refetch();
      refetchTaskDetail();
      message.success("Đánh giá thành công!");
    } catch (err) {
      message.error("Có lỗi xảy ra khi đánh giá!");
    }
  };

  const handleDownloadFile = async (taskId: number) => {
    try {
      const detail = await getTaskDetail(taskId);
      if (detail?.file_Path) {
        window.open(detail.file_Path, "_blank");
      } else {
        message.warning("Không có file để tải.");
      }
    } catch (err) {
      message.error("Tải file thất bại.");
    }
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
      width: 150,
      render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => (
        <Tag
          color={
            status === TASK_STATUS.DONE
              ? "success"
              : status === TASK_STATUS.IN_PROGRESS
              ? "processing"
              : "default"
          }
        >
          {TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] ||
            status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 250,
      render: (_: unknown, record: TaskResponse) => (
        <Space>
          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => openEvaluationModal(record)}
          >
            Đánh giá
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadFile(record.task_id)}
            disabled={record.status === TASK_STATUS.TO_DO}
          >
            Tải file
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Đánh giá công việc">
        <Table
          columns={columns}
          dataSource={tasks || []}
          loading={isLoading}
          rowKey="task_id"
        />
      </Card>

      <EvaluationModal
        visible={isEvaluationModalVisible}
        task={selectedTask}
        taskDetail={taskDetail}
        onCancel={closeModal}
        onSubmit={handleEvaluate}
        loading={isUpdating}
      />
    </>
  );
};

export default StudentEvaluation;
