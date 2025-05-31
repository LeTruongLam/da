import React from "react";
import { Modal, Form, Input, Button, message, Spin, Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createThesis } from "@/services/api/thesis";
import type { ThesisCreateRequest } from "@/services/api/thesis";
import { THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface CreateThesisModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface FormValues {
  title: string;
  description: string;
  status: string;
}

const CreateThesisModal: React.FC<CreateThesisModalProps> = ({
  open,
  onClose,
  refetch,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  const createThesisMutation = useMutation({
    mutationFn: (data: ThesisCreateRequest) => createThesis(data),
    onSuccess: () => {
      message.success("Tạo đề tài thành công!");
      form.resetFields();
      onClose();
      refetch();
    },
    onError: (error: Error) => {
      message.error(`Tạo đề tài thất bại: ${error.message}`);
    },
  });

  const onFinish = (values: FormValues) => {
    const thesisData: ThesisCreateRequest = {
      title: values.title,
      description: values.description,
      status: THESIS_STATUS.AVAILABLE,
      create_by: user?.user_id || 0,
    };
    createThesisMutation.mutate(thesisData);
  };

  const isSubmitting = createThesisMutation.isPending;

  return (
    <Modal
      open={open}
      title="Tạo mới đề tài"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      confirmLoading={isSubmitting}
      okText="Tạo đề tài"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isSubmitting}
        preserve={false}
      >
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" />
        </Form.Item>

        <Form.Item name="status" hidden>
          <Select
            placeholder="Chọn trạng thái"
            options={Object.entries(THESIS_STATUS).map(([key, value]) => ({
              label: THESIS_STATUS_LABELS[value],
              value: value,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả đề tài"
          rules={[{ required: true, message: "Nhập mô tả đề tài!" }]}
        >
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết đề tài..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateThesisModal;
