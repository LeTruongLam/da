import { Card, Table, Tag, Button, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { REQUEST_STATUS_LABELS } from "@/lib/constants";
import {
  getRequestsAll,
  type AllRequestResponse,
} from "@/services/api/request";

const RequestListPage = () => {
  const navigate = useNavigate();

  const {
    data: requestData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["request-all"],
    queryFn: () => getRequestsAll(),
  });

  console.log(requestData);

  const columns = [
    {
      title: "Tên sinh viên",
      dataIndex: "student_name",
      key: "student_name",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Tên đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: AllRequestResponse["status"]) => (
        <Tag>{REQUEST_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: AllRequestResponse) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/request-detail/${record.request_id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card title="Quản lý danh sách đăng ký">
        <Table
          columns={columns}
          dataSource={requestData || []}
          rowKey="thesisId"
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />
      </Card>
    </>
  );
};

export default RequestListPage;
