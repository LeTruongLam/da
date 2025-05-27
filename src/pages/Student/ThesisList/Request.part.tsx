import { REQUEST_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";
import type { ThesisResponse } from "@/services/api";
import { getRequestsAll, type AllRequestResponse } from "@/services/api/request";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, Space, Table } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const RequestTab = () => {
  const navigate = useNavigate();
  const { data: requestData, isLoading } = useQuery({
    queryKey: ["request-all"],
    queryFn: () => getRequestsAll(),
  });

  if (!requestData && !isLoading) {
    return (
      <Empty
        description="Bạn chưa đăng ký đề tài nào"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  console.log(requestData);

  const getRequestColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Giáo viên hướng dẫn",
      dataIndex: "lecturer_name",
      key: "lecturer_name",
      render: (value: string) => <Space>{value || "--"}</Space>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_at",
      key: "create_at",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ThesisResponse["status"]) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label ?? "Không xác định";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record: AllRequestResponse) => (
        <>
          <Button
            disabled={record?.status !== REQUEST_STATUS.IN_PROGRESS}
            onClick={() =>
              navigate(`/request-detail/${record?.request_id}`)
            }
          >
            Xem chi tiết
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={requestData || []}
      rowKey="thesisId"
      loading={isLoading}
      columns={getRequestColumns()}
      pagination={false}
    />
  );
};

export default RequestTab;
