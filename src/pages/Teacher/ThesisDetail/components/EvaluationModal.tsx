import { Modal, Form, Rate, Input } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Student } from "./StudentCard";

const { TextArea } = Input;

interface EvaluationModalProps {
  visible: boolean;
  student: Student | null;
  onCancel: () => void;
  onSubmit: (values: { rating: number; comment: string }) => void;
  form: FormInstance;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  visible,
  student,
  onCancel,
  onSubmit,
  form,
}) => {
  return (
    <Modal
      title={`Đánh giá sinh viên ${student?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu đánh giá"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="rating"
          label="Đánh giá (1-5 sao)"
          rules={[{ required: true, message: "Vui lòng đánh giá" }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="comment"
          label="Nhận xét"
          rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
        >
          <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EvaluationModal;
