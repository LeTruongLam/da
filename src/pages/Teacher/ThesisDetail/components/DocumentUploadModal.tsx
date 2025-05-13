import { Modal, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;

interface DocumentUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  form: FormInstance;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
}) => {
  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  return (
    <Modal
      title="Tải lên tài liệu"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      okText="Tải lên"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="documentTitle"
          label="Tiêu đề tài liệu"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề tài liệu" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề tài liệu" />
        </Form.Item>
        <Form.Item
          name="documentType"
          label="Loại tài liệu"
          rules={[{ required: true, message: "Vui lòng chọn loại tài liệu" }]}
        >
          <Select placeholder="Chọn loại tài liệu">
            <Select.Option value="reference">Tài liệu tham khảo</Select.Option>
            <Select.Option value="template">Mẫu báo cáo</Select.Option>
            <Select.Option value="guide">Hướng dẫn</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="documentFile"
          label="Tập tin"
          rules={[{ required: true, message: "Vui lòng chọn tập tin" }]}
        >
          <Upload.Dragger
            name="files"
            action="/upload"
            onChange={handleUpload}
            beforeUpload={() => false}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo thả tập tin vào khu vực này
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ tải lên một tập tin duy nhất.
            </p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Mô tả tài liệu (không bắt buộc)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal;
