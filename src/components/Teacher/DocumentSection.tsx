import React from "react";
import { Card, Button, Table, Space, Pagination } from "antd";
import {
  FileTextOutlined,
  FileAddOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { styles, props } from "./styles";

interface Document {
  key: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url?: string;
}

interface DocumentSectionProps {
  documents: Document[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onUpload: () => void;
  onDelete: (document: Document) => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  documents,
  page,
  pageSize,
  onPageChange,
  onUpload,
  onDelete,
}) => {
  // Function to get paged data
  const paged = <T,>(data: T[], currentPage: number, size: number) =>
    data.slice((currentPage - 1) * size, currentPage * size);

  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Document) => (
        <Space>
          <FileTextOutlined />
          <a href={record.url} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        </Space>
      ),
    },
    { title: "Kích thước", dataIndex: "size", key: "size" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Document) => (
        <Space>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            size={props.button.size}
          >
            Tải xuống
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
            size={props.button.size}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Tài liệu"
      style={styles.cardSpacing}
      extra={
        <Button
          type="primary"
          icon={<FileAddOutlined />}
          onClick={onUpload}
          size={props.button.size}
        >
          Tải lên
        </Button>
      }
    >
      <div style={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={paged(documents, page, pageSize)}
          pagination={false}
          size={props.table.size}
        />
      </div>
      {documents.length > pageSize && (
        <div style={styles.paginationContainer}>
          <Pagination
            current={page}
            total={documents.length}
            pageSize={pageSize}
            onChange={onPageChange}
            size={props.pagination.size}
          />
        </div>
      )}
    </Card>
  );
};

export default DocumentSection;
