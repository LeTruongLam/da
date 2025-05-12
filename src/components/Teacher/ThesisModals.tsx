import React from "react";
import {
  Modal,
  Form,
  Input,
  Rate,
  Select,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { UploadProps } from "antd";

const { TextArea } = Input;

interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
}

interface SubTask {
  key: string;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  status?: "not_started" | "in_progress" | "completed" | "late";
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

interface EvaluationModalProps {
  visible: boolean;
  onCancel: () => void;
  form: any;
  student: Student | null;
  onFinish: (values: { rating: number; comment: string }) => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  visible,
  onCancel,
  form,
  student,
  onFinish,
}) => (
  <Modal
    title={`Đánh giá sinh viên ${student?.name}`}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText="Lưu đánh giá"
    cancelText="Hủy"
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
        <TextArea rows={4} placeholder="Nhập nhận xét của bạn" size="middle" />
      </Form.Item>
    </Form>
  </Modal>
);

interface TaskFeedbackModalProps {
  visible: boolean;
  onCancel: () => void;
  form: any;
  task: SubTask | null;
  onFinish: (values: { score: number; feedback: string }) => void;
}

export const TaskFeedbackModal: React.FC<TaskFeedbackModalProps> = ({
  visible,
  onCancel,
  form,
  task,
  onFinish,
}) => (
  <Modal
    title={`Đánh giá nhiệm vụ: ${task?.name}`}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText="Lưu đánh giá"
    cancelText="Hủy"
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="score"
        label="Điểm (0-10)"
        rules={[{ required: true, message: "Vui lòng cho điểm" }]}
      >
        <Select size="middle">
          {Array.from({ length: 11 }).map((_, i) => (
            <Select.Option key={i} value={i}>
              {i}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="feedback"
        label="Nhận xét"
        rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
      >
        <TextArea rows={4} placeholder="Nhập nhận xét của bạn" size="middle" />
      </Form.Item>
    </Form>
  </Modal>
);

interface MeetingModalProps {
  visible: boolean;
  onCancel: () => void;
  form: any;
  student: Student | null;
  onFinish: (values: {
    meetingTitle: string;
    meetingDate: dayjs.Dayjs;
    meetingTime: dayjs.Dayjs;
    meetingLink: string;
  }) => void;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  visible,
  onCancel,
  form,
  student,
  onFinish,
}) => (
  <Modal
    title={`Lên lịch họp với sinh viên ${student?.name}`}
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText="Đặt lịch"
    cancelText="Hủy"
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="meetingTitle"
        label="Tiêu đề cuộc họp"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề cuộc họp" }]}
      >
        <Input placeholder="Nhập tiêu đề cuộc họp" size="middle" />
      </Form.Item>
      <Form.Item
        name="meetingDate"
        label="Ngày họp"
        rules={[{ required: true, message: "Vui lòng chọn ngày họp" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="YYYY-MM-DD"
          size="middle"
        />
      </Form.Item>
      <Form.Item
        name="meetingTime"
        label="Giờ họp"
        rules={[{ required: true, message: "Vui lòng chọn giờ họp" }]}
      >
        <DatePicker
          picker="time"
          style={{ width: "100%" }}
          format="HH:mm"
          showNow={false}
          size="middle"
        />
      </Form.Item>
      <Form.Item
        name="meetingLink"
        label="Link cuộc họp (Google Meet, Zoom,...)"
        rules={[{ required: true, message: "Vui lòng nhập link cuộc họp" }]}
      >
        <Input placeholder="https://meet.google.com/..." size="middle" />
      </Form.Item>
    </Form>
  </Modal>
);

interface DocumentUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  form: any;
  onFinish: () => void;
  handleUpload: UploadProps["onChange"];
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onCancel,
  form,
  onFinish,
  handleUpload,
}) => (
  <Modal
    title="Tải lên tài liệu"
    open={visible}
    onCancel={onCancel}
    onOk={() => form.submit()}
    okText="Tải lên"
    cancelText="Hủy"
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="documentName"
        label="Tên tài liệu"
        rules={[{ required: true, message: "Vui lòng nhập tên tài liệu" }]}
      >
        <Input placeholder="Nhập tên tài liệu" size="middle" />
      </Form.Item>
      <Form.Item
        name="documentType"
        label="Loại tài liệu"
        rules={[{ required: true, message: "Vui lòng chọn loại tài liệu" }]}
      >
        <Select placeholder="Chọn loại tài liệu" size="middle">
          <Select.Option value="lesson">Bài giảng</Select.Option>
          <Select.Option value="assignment">Đề bài</Select.Option>
          <Select.Option value="reference">Tài liệu tham khảo</Select.Option>
          <Select.Option value="other">Khác</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="file"
        label="File tài liệu"
        rules={[{ required: true, message: "Vui lòng tải lên file tài liệu" }]}
      >
        <Upload onChange={handleUpload}>
          <Button icon={<UploadOutlined />} size="middle">
            Chọn file
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  </Modal>
);

interface SubtaskModalProps {
  visible: boolean;
  onCancel: () => void;
  form: any;
  currentSubtask: SubTask | null;
  onFinish: (values: {
    name: string;
    description: string;
    startDate: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
  }) => void;
}

export const SubtaskModal: React.FC<SubtaskModalProps> = ({
  visible,
  onCancel,
  form,
  currentSubtask,
  onFinish,
}) => (
  <Modal
    title={currentSubtask ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
    open={visible}
    onCancel={() => {
      onCancel();
      form.resetFields();
    }}
    onOk={() => form.submit()}
    okText={currentSubtask ? "Cập nhật" : "Thêm mới"}
    cancelText="Hủy"
  >
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Tên công việc"
        rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
      >
        <Input placeholder="Nhập tên công việc" size="middle" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
      >
        <TextArea
          rows={3}
          placeholder="Nhập mô tả chi tiết về công việc"
          size="middle"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker style={{ width: "100%" }} size="middle" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: "Vui lòng chọn deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} size="middle" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
);

interface ConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title,
  content,
}) => (
  <Modal
    title={title}
    open={visible}
    onCancel={onCancel}
    onOk={onConfirm}
    okText="Xác nhận"
    cancelText="Hủy"
    okButtonProps={{ danger: true }}
  >
    <p>{content}</p>
  </Modal>
);
