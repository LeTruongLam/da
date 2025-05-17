import {
  Card,
  Form,
  Input,
  Button,
  Progress,
  Upload,
  Table,
  Pagination,
  message,
  Space,
  Modal,
  Spin,
  Empty,
} from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { useState } from "react";
import { StatusTag } from "@/components/ui";

const PAGE_SIZE = 5;

// Define types
interface FileData {
  key: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: "approved" | "pending" | "rejected";
}

interface ProgressFormValues {
  progress: number;
  desc?: string;
}

// Mock tài liệu đã upload
const mockFiles: FileData[] = Array.from({ length: 12 }).map((_, i) => ({
  key: String(i + 1),
  name: `Tài liệu ${i + 1}.${
    i % 3 === 0 ? "pdf" : i % 3 === 1 ? "docx" : "zip"
  }`,
  type: i % 3 === 0 ? "pdf" : i % 3 === 1 ? "docx" : "zip",
  uploadedAt: `2024-06-${10 + (i % 10)}`,
  status: i % 4 === 0 ? "approved" : i % 4 === 1 ? "pending" : "rejected",
}));

const ProgressUpdate = () => {
  const [form] = Form.useForm<ProgressFormValues>();
  const [progress, setProgress] = useState(60);
  const [files, setFiles] = useState<FileData[]>(mockFiles);
  const [filePage, setFilePage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const paged = <T,>(data: T[], page: number) =>
    data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleProgressUpdate = (values: ProgressFormValues) => {
    setProgress(values.progress);
    message.success("Cập nhật tiến độ thành công!");
  };

  const handleUpload = (info: any) => {
    setUploading(true);
    setTimeout(() => {
      setFiles([
        ...files,
        {
          key: String(files.length + 1),
          name: info.file.name,
          type: info.file.name.split(".").pop(),
          uploadedAt: new Date().toISOString().slice(0, 10),
          status: "pending",
        },
      ]);
      setUploading(false);
      message.success("Tải lên thành công! Vui lòng chờ duyệt.");
    }, 1000);
  };

  return (
    <Card
      title="Cập nhật tiến độ & Tải lên tài liệu"
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleProgressUpdate}
        initialValues={{ progress }}
      >
        <Form.Item
          name="progress"
          label="Tiến độ (%)"
          rules={[{ required: true, message: "Nhập tiến độ!" }]}
        >
          <Input type="number" min={0} max={100} suffix="%" />
        </Form.Item>
        <Form.Item name="desc" label="Mô tả tiến độ">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết tiến độ..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật tiến độ
          </Button>
        </Form.Item>
      </Form>
      <div style={{ margin: "16px 0" }}>
        <Progress
          percent={progress}
          status={progress === 100 ? "success" : "active"}
        />
      </div>
      <Upload
        showUploadList={false}
        customRequest={handleUpload}
        multiple
        accept=".pdf,.docx,.zip,.rar,.txt"
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Tải lên tài liệu
        </Button>
      </Upload>
      <Card title="Tài liệu đã upload" style={{ marginTop: 24 }}>
        <Table
          columns={[
            {
              title: "Tên file",
              dataIndex: "name",
              key: "name",
              render: (name) => (
                <>
                  <FileTextOutlined /> {name}
                </>
              ),
            },
            { title: "Loại", dataIndex: "type", key: "type" },
            {
              title: "Ngày tải lên",
              dataIndex: "uploadedAt",
              key: "uploadedAt",
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status: "approved" | "pending" | "rejected") => (
                <StatusTag type="task" status={status} />
              ),
            },
          ]}
          dataSource={paged(files, filePage)}
          pagination={false}
          scroll={{ y: 200 }}
        />
        <Pagination
          current={filePage}
          pageSize={PAGE_SIZE}
          total={files.length}
          onChange={setFilePage}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </Card>
  );
};

export default ProgressUpdate;
