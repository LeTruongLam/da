import { Modal, Form, Input, DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

export interface TaskFormValues {
  task_name: string;
  description: string;
  due_date: Dayjs;
}

interface TaskModalProps {
  visible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subtask: any;
  onCancel: () => void;
  refetchTasks?: () => void;
}

const SubtaskModal: React.FC<TaskModalProps> = ({
  visible,
  subtask,
  refetchTasks,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const isEdit = !!subtask;

  useEffect(() => {
    if (subtask) {
      form.setFieldsValue({
        task_name: subtask.task_name,
        description: subtask.description,
        due_date: dayjs(subtask.due_date),
      });
    }
  }, [subtask, form]);

  const onSubmit = (values: TaskFormValues) => {
    const payload = {
      ...values,
      due_date: values.due_date.toISOString(), // có cả giờ
    };

    console.log(payload);
    onCancel();
    form.resetFields();
    refetchTasks?.();
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText={isEdit ? "Cập nhật" : "Thêm mới"}
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
          rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
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
  );
};

export default SubtaskModal;
