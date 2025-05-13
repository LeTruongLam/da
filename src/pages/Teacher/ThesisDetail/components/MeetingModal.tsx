import { Modal, Form, Input, DatePicker } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Student } from "./StudentCard";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;

export interface MeetingFormValues {
  meetingTitle: string;
  meetingDate: Dayjs;
  meetingLink: string;
  description?: string;
}

interface MeetingModalProps {
  visible: boolean;
  student: Student | null;
  onCancel: () => void;
  onSubmit: (values: MeetingFormValues) => void;
  form: FormInstance;
}

const MeetingModal: React.FC<MeetingModalProps> = ({
  visible,
  student,
  onCancel,
  onSubmit,
  form,
}) => {
  return (
    <Modal
      title={`Đặt lịch họp với ${student?.name || "sinh viên"}`}
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Đặt lịch"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="meetingTitle"
          label="Tiêu đề cuộc họp"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề cuộc họp" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề cuộc họp" />
        </Form.Item>
        <Form.Item
          name="meetingDate"
          label="Thời gian"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="meetingLink"
          label="Link Google Meet"
          rules={[
            { required: true, message: "Vui lòng nhập link Google Meet" },
          ]}
        >
          <Input placeholder="https://meet.google.com/..." />
        </Form.Item>
        <Form.Item name="description" label="Nội dung cuộc họp">
          <TextArea rows={4} placeholder="Mô tả nội dung cuộc họp" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MeetingModal;
