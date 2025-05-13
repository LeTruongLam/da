import { Modal, Form, Input, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { SubTask } from "./TasksTable";

const { TextArea } = Input;
const { Option } = Select;

interface TaskFeedbackModalProps {
  visible: boolean;
  task: SubTask | null;
  onCancel: () => void;
  onSubmit: (values: {
    score: number;
    feedback: string;
    status: string;
  }) => void;
  form: FormInstance;
}

const TaskFeedbackModal: React.FC<TaskFeedbackModalProps> = ({
  visible,
  task,
  onCancel,
  onSubmit,
  form,
}) => {
  return (
    <Modal
      title={`Đánh giá nhiệm vụ: ${task?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu đánh giá"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="completed">Hoàn thành</Option>
            <Option value="incomplete">Chưa hoàn thành</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="feedback"
          label="Nhận xét"
          rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
        >
          <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFeedbackModal;
