import { Form, Input, Modal, message } from "antd";
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
  refetch?: () => void;
}

const CreateRequestModal = ({
  visible,
  onCancel,
  refetch,
}: CreateRequestModalProps) => {
  const [form] = useForm();

  const { mutate: handleCreateThesis, isPending } = useMutation({
    mutationFn: (data: ThesisCreateRequest) => createThesis(data),
    onSuccess: () => {
      message.success("Tạo đề tài thành công!");
      form.resetFields();
      onCancel();
      refetch?.();
    },
    onError: (error) => {
      console.error("Tạo đề tài thất bại:", error);
      message.error("Tạo đề tài thất bại!");
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
    handleCreateThesis(data);
  };

  return (
    <Modal
      title="Tạo đề tài mới"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Tạo đề tài"
      cancelText="Hủy"
      confirmLoading={isPending} // loading nút submit
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề đề tài" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" disabled={isPending} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả đề tài" }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết về đề tài"
            disabled={isPending}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRequestModal;
