import { Card, Table, Button, Space, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getMaterialByThesis } from "@/services/api/material";
import { handleDownload } from "@/lib/ultils";

interface DocumentPartComponentProps {
  thesisId: number | undefined;
}

const DocumentPartComponent: React.FC<DocumentPartComponentProps> = ({
  thesisId,
}) => {
  const { data: documentsData = [], isLoading: loading } = useQuery({
    queryKey: ["documents", thesisId],
    queryFn: () => {
      if (!thesisId) return [];
      return getMaterialByThesis(thesisId);
    },
    enabled: !!thesisId,
  });

  return (
    <>
      <Card title={"Tài liệu"}>
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
    </>
  );
};

export default DocumentPartComponent;
