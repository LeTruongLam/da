import { Card, Table, Tag, Button, Checkbox, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { REQUEST_STATUS, REQUEST_STATUS_LABELS } from "@/lib/constants";
import {
  getRequestsAll,
  type AllRequestResponse,
} from "@/services/api/request";
import { useState, useMemo } from "react";

const RequestListPage = () => {
  const navigate = useNavigate();

  const {
    data: requestData,
    isLoading,
  } = useQuery({
    queryKey: ["request-all"],
    queryFn: () => getRequestsAll(),
  });

  //  Loại bỏ mặc định các trạng thái bị từ chối hoặc bị hủy
  const hiddenStatuses = [
    REQUEST_STATUS.CANCEL,
    REQUEST_STATUS.REVOKE,
    REQUEST_STATUS.ADMIN_REJECT,
  ];

  const defaultStatuses = Object.keys(REQUEST_STATUS_LABELS).filter(
    (status) => !hiddenStatuses.includes(status)
  );

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(defaultStatuses);

  const filteredData = useMemo(() => {
    if (!requestData) return [];
    return requestData.filter((item) => selectedStatuses.includes(item.status));
  }, [requestData, selectedStatuses]);

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
    <Card title="Quản lý danh sách đăng ký">
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Checkbox.Group
          options={Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => ({
            label,
            value,
          }))}
          value={selectedStatuses}
          onChange={(checkedValues) => setSelectedStatuses(checkedValues as string[])}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="request_id"
        scroll={{ x: "max-content" }}
        loading={isLoading}
      />
    </Card>
  );
};

export default RequestListPage;
