import { Modal, Form, Input, DatePicker, Row, Col, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Dayjs } from "dayjs";
import type { SubTask } from "./TasksTable";

const { TextArea } = Input;
const { Option } = Select;

export interface SubtaskFormValues {
  name: string;
  description: string;
  startDate: Dayjs;
  deadline: Dayjs;
  status?: string;
}

interface SubtaskModalProps {
  visible: boolean;
  subtask: SubTask | null;
  onCancel: () => void;
  onSubmit: (values: SubtaskFormValues) => void;
  form: FormInstance;
}

const SubtaskModal: React.FC<SubtaskModalProps> = ({
  visible,
  subtask,
  onCancel,
  onSubmit,
  form,
}) => {
  const isEdit = !!subtask;

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
          name="name"
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[{ required: true, message: "Vui lòng chọn deadline" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: isEdit, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái công việc">
            <Option value="not_started">Chưa bắt đầu</Option>
            <Option value="in_progress">Đang thực hiện</Option>
            <Option value="completed">Đã hoàn thành</Option>
            <Option value="late">Trễ hạn</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubtaskModal;
