import { Card, Table, Button, Space, Pagination, Spin } from "antd";
import {
  FileTextOutlined,
  FileAddOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { MaterialsType } from "@/services/api";

export interface Document {
  key: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

interface DocumentsTableProps {
  documents: MaterialsType[];
  currentPage: number;
  pageSize: number;
  onUpload: () => void;
  onDelete: (document: Document) => void;
  onPageChange: (page: number) => void;
  filter?: (doc: Document) => boolean;
  title?: string;
  loading?: boolean;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  currentPage,
  pageSize,
  onUpload,
  onDelete,
  onPageChange,
  filter,
  title = "Tài liệu",
  loading = false,
}) => {
  const mappedDocuments = documents.map((material) => ({
    key: material.material_id.toString(),
    name: material.file_name,
    type: material.file_type,
    uploadedBy: material.user_name,
    uploadedAt: material.create_at,
    size: "N/A",
    url: material.file_path,
  }));

  const filteredDocuments = filter
    ? mappedDocuments.filter(filter)
    : mappedDocuments;
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={title}
      extra={
        <Button type="primary" icon={<FileAddOutlined />} onClick={onUpload}>
          Tải lên
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Table
          columns={[
            {
              title: "Tên tài liệu",
              dataIndex: "name",
              key: "name",
              render: (text, record) => (
                <Space>
                  <FileTextOutlined />
                  <a
                    href={record.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                </Space>
              ),
            },
            {
              title: "Thao tác",
              key: "action",
              render: (_, record) => (
                <Space>
                  <Button type="link" icon={<DownloadOutlined />}>
                    Tải xuống
                  </Button>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(record)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={paginatedDocuments}
          pagination={false}
          size="small"
          loading={loading}
        />
        {filteredDocuments.length > pageSize && (
          <Pagination
            current={currentPage}
            total={filteredDocuments.length}
            pageSize={pageSize}
            onChange={onPageChange}
            size="small"
            style={{ marginTop: 16, textAlign: "right" }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default DocumentsTable;
