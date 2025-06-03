import { Card, Table, Typography, Row, Col, Statistic, Button } from "antd";
import { BookOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  getRequestsAll,
  type AllRequestResponse,
} from "@/services/api/request";
import { REQUEST_STATUS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { data: requestData, isLoading } = useQuery({
    queryKey: ["request-all-in-progress", REQUEST_STATUS.IN_PROGRESS],
    queryFn: () => getRequestsAll(REQUEST_STATUS.IN_PROGRESS),
  });
  const { data: requestDataAll } = useQuery({
    queryKey: ["request-all", REQUEST_STATUS.IN_PROGRESS],
    queryFn: () => getRequestsAll(),
  });

  const totalRequests = requestData?.length || 0;

  const columns = [
    {
      title: "Sinh viên",
      dataIndex: "student_name",
      key: "student_name",
      width: 300,
    },
    {
      title: "Tên đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
      render: (title: string) => title || "Chưa có tên đề tài",
    },
    {
      title: "Ngày tạo",
      key: "create_at",
      dataIndex: "create_at",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record: AllRequestResponse) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(`/request-detail/${record.request_id}`)}
          type="link"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Bảng điều khiển giảng viên</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số đề tài"
              value={requestDataAll?.length}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số đề tài đang làm"
              value={totalRequests}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={4}>Danh sách đề tài đang làm</Title>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={requestData || []}
          rowKey={(record) => record.request_id}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard;
