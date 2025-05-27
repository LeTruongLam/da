import { REQUEST_STATUS, ROUTES, THESIS_STATUS_LABELS } from "@/lib/constants";
import type { ThesisResponse } from "@/services/api";
import { getRequestsCurrent } from "@/services/api/request";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";

const RequestTab = () => {
  const navigate = useNavigate();
  const { data: currentData, isLoading } = useQuery({
    queryKey: ["currentRequest"],
    queryFn: () => getRequestsCurrent(),
  });

  if (!currentData && !isLoading) {
    return (
      <Empty
        description="Bạn chưa đăng ký đề tài nào"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const getMyThesesColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "thesisTitle",
      key: "thesisTitle",
      render: (text: string) => <span>{text}</span>, // ✅ Sửa lỗi JSX
      ellipsis: true,
    },
    {
      title: "Giáo viên hướng dẫn",
      dataIndex: "lecturerName",
      key: "lecturerName",
      render: (value: string) => <Space>{value || "--"}</Space>,
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
      render: () => (
        <>
          <Button
            disabled={currentData?.status !== REQUEST_STATUS.IN_PROGRESS}
            onClick={() =>
              navigate(`${ROUTES.THESIS_DETAIL}/${currentData?.request_id}`)
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
      dataSource={currentData ? [currentData] : []}
      rowKey="thesisId"
      loading={isLoading}
      columns={getMyThesesColumns()}
      pagination={false}
    />
  );
};

export default RequestTab;
