import { useEffect } from "react";
import { Form, Input, Modal, DatePicker, Select, Row, Col } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { getMajors } from "@/services/api/major";
import type { Major } from "@/services/api/major";
import { useQuery } from "@tanstack/react-query";

const { TextArea } = Input;

interface ThesisData {
  id: string;
  title: string;
  description: string;
  major: string;
  status: string;
  deadline: string;
}

interface EditThesisFormValues {
  title: string;
  description: string;
  major: string;
  status: string;
  deadline: dayjs.Dayjs;
}

interface EditThesisModalProps {
  visible: boolean;
  thesis: ThesisData;
  onCancel: () => void;
  onOk: (values: EditThesisFormValues) => void;
}

const EditThesisModal = ({
  visible,
  thesis,
  onCancel,
  onOk,
}: EditThesisModalProps) => {
  const [form] = useForm();

  // Fetch majors data using react-query
  const { data: majors, isLoading: isMajorsLoading } = useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
  });

  // Set form values when modal becomes visible or thesis changes
  useEffect(() => {
    if (visible && thesis) {
      form.setFieldsValue({
        title: thesis.title,
        description: thesis.description,
        major: thesis.major,
        status: thesis.status,
        deadline: thesis.deadline ? dayjs(thesis.deadline) : undefined,
      });
    }
  }, [visible, thesis, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
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
    >
      <Form form={form} layout="vertical" onFinish={onOk}>
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
              name="major"
              label="Chuyên ngành"
              rules={[
                { required: true, message: "Vui lòng chọn chuyên ngành" },
              ]}
            >
              <Select placeholder="Chọn chuyên ngành" loading={isMajorsLoading}>
                {majors?.map((major: Major) => (
                  <Select.Option
                    key={major.majorId}
                    value={major.majorId.toString()}
                  >
                    {major.majorName}
                  </Select.Option>
                ))}
              </Select>
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
