import { Modal, Form, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createMaterial } from "@/services/api/material";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface DocumentUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  thesisId: number | undefined;
}

type DocumentFormType = {
  document_file: UploadFile[];
};

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  thesisId,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm<DocumentFormType>();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (values: DocumentFormType) => {
    if (!thesisId) {
      message.error("Không tìm thấy thông tin đồ án");
      return;
    }

    try {
      setUploading(true);
      const file = values.document_file[0].originFileObj as File;

      // Upload to Cloudinary first
      const fileUploaded = await uploadToCloudinary(file, "materials");

      console.log("File uploaded to Cloudinary:", fileUploaded);
      const data = {
        fileName: fileUploaded.original_filename,
        filePath: fileUploaded.url,
        fileType: fileUploaded.resource_type,
        createAt: fileUploaded.created_at,
        user_public_id: user?.user_id as number,
        thesis_id: thesisId,
      };

      await createMaterial(data);

      message.success("Tải lên tài liệu thành công");
      onSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Tải lên tài liệu thất bại");
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-rar-compressed",
        "image/jpeg",
        "image/png",
      ];

      const isAllowedType = allowedTypes.includes(file.type);
      if (!isAllowedType) {
        message.error(
          "Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, RAR, JPG, PNG!"
        );
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    multiple: false,
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
      confirmLoading={uploading}
    >
      <Form form={form} layout="vertical" onFinish={handleUpload}>
        <Form.Item
          name="document_file"
          label="Tập tin"
          rules={[{ required: true, message: "Vui lòng chọn tập tin" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList || []}
        >
          <Upload.Dragger
            name="files"
            beforeUpload={uploadProps.beforeUpload}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo thả tập tin vào khu vực này
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ các định dạng: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP,
              RAR, JPG, PNG
              <br />
              Kích thước tối đa: 10MB
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal;
