import { Card, Table, Button, Space, Spin } from "antd";
import {
  FileAddOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DocumentUploadModal from "./DocumentUploadModal";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMaterialByThesis,
  type MaterialsByThesisType,
} from "@/services/api/material";

interface DocumentsTableProps {
  thesisId: number | undefined;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ thesisId }) => {
  const [isDocumentUploadModalVisible, setIsDocumentUploadModalVisible] =
    useState(false);
  const queryClient = useQueryClient();

  const { data: documentsData = [], isLoading: loading } = useQuery({
    queryKey: ["documents", thesisId],
    queryFn: () => {
      if (!thesisId) return [];
      return getMaterialByThesis(thesisId);
    },
  });

  const onUpload = () => {
    setIsDocumentUploadModalVisible(true);
  };

  const handleUploadSuccess = () => {
    setIsDocumentUploadModalVisible(false);
    queryClient.invalidateQueries({ queryKey: ["documents", thesisId] });
  };

  return (
    <>
      <Card
        title={"Tài liệu"}
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
                dataIndex: "file_name",
                key: "file_name",
              },
              {
                title: "Thao tác",
                key: "action",
                render: (_, record: MaterialsByThesisType) => (
                  <Space>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Tải xuống
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={documentsData}
            pagination={false}
            size="small"
            loading={loading}
          />
        </Spin>
      </Card>
      <DocumentUploadModal
        visible={isDocumentUploadModalVisible}
        onCancel={() => setIsDocumentUploadModalVisible(false)}
        onSuccess={handleUploadSuccess}
        thesisId={thesisId}
      />
    </>
  );
};

export default DocumentsTable;
