import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getThesisById,
  updateThesis as updateThesisApi,
  type ThesisUpdateRequest,
} from "@/services/api";
import { THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";

const { TextArea } = Input;

interface EditThesisFormValues {
  title: string;
  description: string;
  status: string;
}

interface EditThesisModalProps {
  visible: boolean;
  onCancel: () => void;
}

const EditThesisModal = ({ visible, onCancel }: EditThesisModalProps) => {
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();

  const thesisId = Number(id);

  const { data: thesis } = useQuery({
    queryKey: ["thesis", thesisId],
    queryFn: () => getThesisById(thesisId),
    enabled: !!id,
  });

  const { mutate: handleUpdateThesis, isPending } = useMutation({
    mutationFn: (values: ThesisUpdateRequest) =>
      updateThesisApi(thesisId, { ...values, thesis_id: thesisId }),
    onSuccess: () => {
      form.resetFields();
      onCancel();
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });

  useEffect(() => {
    if (visible && thesis) {
      form.setFieldsValue({
        title: thesis.title,
        description: thesis.description,
        status: thesis.status,
      });
    }
  }, [visible, thesis, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: EditThesisFormValues) => {
    handleUpdateThesis(values as ThesisUpdateRequest);
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin đề tài"
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

        <Form.Item name="status" label="Trạng thái">
          <Select
            placeholder="Chọn trạng thái"
            options={Object.entries(THESIS_STATUS).map(([key, value]) => ({
              label: THESIS_STATUS_LABELS[value],
              value,
            }))}
          />
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

export default EditThesisModal;
