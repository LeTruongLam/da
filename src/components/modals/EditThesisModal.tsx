import { useEffect } from "react";
import { Form, Input, Modal, Select, Row, Col, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { getMajors } from "@/services/api/major";
import { updateThesis, getThesisById } from "@/services/api/thesis";
import { THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";

const { TextArea } = Input;

interface EditThesisFormValues {
  title: string;
  description: string;
  majorId: string;
  status: string;
  deadline?: dayjs.Dayjs;
}

interface EditThesisModalProps {
  visible: boolean;
  onCancel: () => void;
  onRefetch: () => void;
}

const EditThesisModal = ({
  visible,
  onCancel,
  onRefetch,
}: EditThesisModalProps) => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const { id: thesisId } = useParams<{ id: string }>();

  // Fetch thesis details when modal becomes visible
  const { data: thesisDetails, isLoading: isLoadingThesis } = useQuery({
    queryKey: [`thesis-${thesisId}`],
    queryFn: () => {
      if (!thesisId) {
        throw new Error("Thesis ID is required");
      }
      return getThesisById(parseInt(thesisId));
    },
    enabled: visible && !!thesisId,
  });

  const { data: majors = [], isLoading: isMajorsLoading } = useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
  });

  // Mutation for updating thesis
  const updateThesisMutation = useMutation({
    mutationFn: (values: EditThesisFormValues) => {
      if (!thesisId) {
        throw new Error("Thesis ID is required");
      }
      return updateThesis({
        thesisId: parseInt(thesisId),
        title: values.title,
        description: values.description,
        majorId: parseInt(values.majorId),
        status: values.status,
      });
    },
    onSuccess: () => {
      message.success("Cập nhật đề tài thành công");
      queryClient.invalidateQueries({ queryKey: ["theses"] });
      queryClient.invalidateQueries({ queryKey: ["thesis", thesisId] });
      form.resetFields();
      onCancel();
      onRefetch();
    },
    onError: (error) => {
      message.error(`Lỗi khi cập nhật đề tài: ${error}`);
    },
  });

  // Set form values when thesis details are loaded
  useEffect(() => {
    if (visible && thesisDetails) {
      form.setFieldsValue({
        title: thesisDetails.title,
        description: thesisDetails.description,
        majorId: thesisDetails.major?.majorId || "",
        status:
          THESIS_STATUS_LABELS[
            thesisDetails.status as keyof typeof THESIS_STATUS_LABELS
          ] || thesisDetails.status,
      });
    }
  }, [visible, thesisDetails, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: EditThesisFormValues) => {
    updateThesisMutation.mutate(values);
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin đề tài"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      width={700}
      confirmLoading={updateThesisMutation.isPending || isLoadingThesis}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề đề tài"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề đề tài" }]}
        >
          <Input placeholder="Nhập tiêu đề đề tài" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="majorId"
              label="Chuyên ngành"
              rules={[
                { required: true, message: "Vui lòng chọn chuyên ngành!" },
              ]}
            >
              <Select
                placeholder="Chọn chuyên ngành"
                loading={isMajorsLoading}
                options={majors.map((major) => ({
                  label: major.majorName,
                  value: major.majorId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="Đang mở">Đang mở</Select.Option>
                <Select.Option value="Đã đóng">Đã đóng</Select.Option>
                <Select.Option value="Đã hoàn thành">
                  Đã hoàn thành
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
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
