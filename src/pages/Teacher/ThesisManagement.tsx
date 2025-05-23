import { Card, Table, Tag, Button, Pagination, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getMyTheses } from "@/services/api/thesis";
import type { ThesisResponse } from "@/services/api/thesis";
import type { Key } from "react";
import { TASK_STATUS_COLORS, THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";

const ThesisManagement = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch theses data using useQuery
  const { data: theses = [], isLoading } = useQuery<ThesisResponse[]>({
    queryKey: ["myTheses"],
    queryFn: getMyTheses,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 1000, // 1 giây
  });

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: Object.entries(THESIS_STATUS).map(([_, value]) => ({
        text: THESIS_STATUS_LABELS[value],
        value,
      })),
      onFilter: (value: string | number | boolean, record: ThesisResponse) =>
        record.status === value,
      render: (status: ThesisResponse["status"]) => (
        <Tag color={TASK_STATUS_COLORS[status]}>{THESIS_STATUS_LABELS[status]}</Tag>
      ),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: () => "--",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: ThesisResponse) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/thesis-detail/${record.thesis_id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Phân trang cho dữ liệu
  const paginatedData = theses.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <>
      <Card
        title="Quản lý đồ án"
        extra={
          <Button type="primary" onClick={() => navigate("/create-thesis")}>
            Tạo mới đề tài
          </Button>
        }
      >
        <Alert
          message="Lưu ý: Mỗi đề tài chỉ được phép gán cho một sinh viên"
          description="Nếu đề tài đã có sinh viên đăng ký, bạn không thể thêm sinh viên khác vào đề tài này."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="thesisId"
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />
        <Pagination
          current={current}
          pageSize={pageSize}
          total={theses.length}
          onChange={(page) => setCurrent(page)}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrent(current);
          }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} đề tài`}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>
    </>
  );
};

export default ThesisManagement;
