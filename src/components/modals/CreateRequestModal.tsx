import { Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useMutation } from "@tanstack/react-query";
import { createThesis, type ThesisCreateRequest } from "@/services/api";
import { THESIS_STATUS } from "@/lib/constants";

const { TextArea } = Input;

interface CreateThesisFormValues {
  title: string;
  description: string;
  status: string;
}

interface CreateRequestModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateRequestModal = ({ visible, onCancel }: CreateRequestModalProps) => {
  const [form] = useForm();

  const { mutate: handleCreateThesis, isPending } = useMutation({
    mutationFn: (data: ThesisCreateRequest) => createThesis(data),
    onSuccess: () => {
      form.resetFields();
      onCancel();
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: CreateThesisFormValues) => {
    const data = {
      ...values,
      status: THESIS_STATUS.AVAILABLE,
    };
    handleCreateThesis(data as ThesisCreateRequest);
  };

  return (
    <Modal
      title="Thông tin đề tài"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={isPending}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề đề tài" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả đề tài" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết về đề tài" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRequestModal;
