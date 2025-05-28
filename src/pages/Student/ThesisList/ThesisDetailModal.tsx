import { useEffect } from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteThesis,
  getThesisById,
  updateThesis as updateThesisApi,
  type ThesisUpdateRequest,
} from "@/services/api";
import { THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";

const { TextArea } = Input;

interface ThesisFormValues {
  title: string;
  description: string;
  status: string;
}

interface ThesisModalProps {
  visible: boolean;
  thesis_id: number;
  onCancel: () => void;
  refetch?: () => void;
}

const ThesisDetailModal = ({
  visible,
  onCancel,
  thesis_id,
  refetch,
}: ThesisModalProps) => {
  const [form] = useForm();

  const { data: thesis } = useQuery({
    queryKey: ["thesis-detail-by-id", thesis_id],
    queryFn: () => getThesisById(thesis_id),
    enabled: !!thesis_id,
  });

  const { mutate: handleDeleteMution } = useMutation({
    mutationFn: () => deleteThesis(thesis_id),
    onSuccess: () => {
      message.success("Xóa đề tài thành công!");
      onCancel();
      refetch?.();
    },
    onError: (error) => {
      message.error(`Xóa đề tài thất bại`);
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

  const handleDelete = () => {
    handleDeleteMution();
  };

  return (
    <Modal
      title="Thông tin đề tài"
      open={visible}
      width={700}
      onCancel={handleCancel}
      footer={
        <>
          <Button
            disabled={
              thesis?.status === THESIS_STATUS.ADMIN_REJECT ||
              thesis?.status === THESIS_STATUS.REVOKE ||
              thesis?.status === THESIS_STATUS.IN_PROGRESS
            }
            danger
            key="delete"
            onClick={handleDelete}
          >
            Xóa
          </Button>

          <Button key="confirm" type="primary" onClick={() => form.submit()}>
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề đề tài" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select
            disabled
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

export default ThesisDetailModal;
