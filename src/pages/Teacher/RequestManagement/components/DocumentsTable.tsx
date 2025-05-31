import { Card, Table, Button, Space, Spin, Modal, message } from "antd";
import {
  FileAddOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DocumentUploadModal from "./DocumentUploadModal";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMaterial,
  getMaterialByThesis,
  type MaterialsByThesisType,
} from "@/services/api/material";
import { handleDownload } from "@/lib/ultils";

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
    enabled: !!thesisId,
  });

  const { mutate: handleDeleteDocument, isPending: deleting } = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      message.success("Xóa tài liệu thành công");
      queryClient.invalidateQueries({ queryKey: ["documents", thesisId] });
    },
    onError: () => {
      message.error("Xóa tài liệu thất bại");
    },
  });

  const showDeleteConfirm = (materialId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tài liệu này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteDocument(materialId);
      },
    });
  };

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
        <Spin spinning={loading || deleting}>
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
                width: 200,
                render: (
                  _,
                  record: {
                    material_id: number;
                    file_name: string;
                    file_path: string;
                    file_type: string;
                    user_public_id: number;
                    user_name: string;
                    thesis_id: number;
                    create_at: string;
                    update_at: string;
                    deleted: boolean;
                  }
                ) => (
                  <Space>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        handleDownload(record.file_path, record.file_name)
                      }
                    >
                      Tải xuống
                    </Button>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(record.material_id)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={documentsData}
            pagination={false}
            size="small"
            rowKey="id"
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
