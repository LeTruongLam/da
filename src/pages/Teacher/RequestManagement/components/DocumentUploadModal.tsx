import { Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

interface DocumentUploadModalProps {
  visible: boolean;
  onCancel: () => void;
}

type DocumentFormType = {
  document_title: string;
  document_file: UploadFile[];
};

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onCancel,
}) => {
  const [form] = Form.useForm<DocumentFormType>();

  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const onSubmit = () => {};

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
          name="document_title"
          label="Tiêu đề tài liệu"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề tài liệu" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề tài liệu" />
        </Form.Item>
        <Form.Item
          name="document_file"
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
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal;
