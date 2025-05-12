import { Card, Table, Tag, Button, Pagination, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getMyTheses } from "@/services/api/thesis";
import type { ThesisResponse } from "@/services/api/thesis";
import type { Key } from "react";
import { formatDate } from "@/lib/ultils";

const ThesisManagement = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch theses data using useQuery
  const { data: theses = [], isLoading } = useQuery<ThesisResponse[]>({
    queryKey: ["myTheses"],
    queryFn: getMyTheses,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
      title: "Giảng viên",
      dataIndex: "lecturer",
      key: "lecturer",
      render: (lecturer: ThesisResponse["lecturer"]) => (
        <span>
          <UserOutlined /> {lecturer.name}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang mở", value: "available" },
        { text: "Đang thực hiện", value: "in_progress" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Không khả dụng", value: "not available" },
        { text: "Tạm hoãn", value: "on hold" },
      ],
      onFilter: (value: boolean | Key, record: ThesisResponse) =>
        record.status === value,
      render: (status: ThesisResponse["status"]) => {
        const statusMap = {
          available: { color: "processing", text: "Đang mở" },
          in_progress: { color: "processing", text: "Đang thực hiện" },
          completed: { color: "success", text: "Hoàn thành" },
          "not available": { color: "default", text: "Không khả dụng" },
          "on hold": { color: "warning", text: "Tạm hoãn" },
        };
        const { color, text } = statusMap[status];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Ngành",
      dataIndex: ["major", "majorName"],
      key: "major",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (createAt: ThesisResponse["createAt"]) => formatDate(createAt),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: unknown, record: ThesisResponse) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/thesis-detail/${record.thesisId}`)}
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
