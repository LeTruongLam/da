import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Typography,
  Space,
  Tag,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getRequestDetail } from "@/services/api/request";
import { TASK_STATUS, TASK_STATUS_LABELS } from "@/lib/constants";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const StudentDashboard = () => {
  const { currentRequest } = useSelector((state: RootState) => state.app);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: requestData, isLoading: requestLoading } = useQuery({
    queryKey: ["student-request-dashboard", currentRequest, user?.user_id],
    queryFn: async () => {
      if (!currentRequest) return null;

      const result = await getRequestDetail(Number(currentRequest));
      return result;
    },
    enabled: !!currentRequest,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const countTaskCompleted =
    requestData?.tasks.filter((task) => task.status === TASK_STATUS.DONE)
      .length || 0;

  const countTaskTotal = requestData?.tasks.length;

  const countTaskToDo = requestData?.tasks.filter(
    (task) => task.status === TASK_STATUS.TO_DO
  ).length;

  const countTaskDoing = requestData?.tasks.filter(
    (task) => task.status === TASK_STATUS.IN_PROGRESS
  ).length;

  const upcomingDeadlinesColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const label =
          TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS];
        return label ?? "Không xác định";
      },
    },
    {
      title: "Hạn nộp",
      dataIndex: "due_date",
      key: "due_date",
      render: (date: string) => {
        const now = dayjs();
        const due = dayjs(date);
        const hoursDiff = due.diff(now, "hour");

        const isUrgent = hoursDiff <= 24;

        return (
          <Tag icon={<ClockCircleOutlined />} color={isUrgent ? "red" : "blue"}>
            {due.format("DD/MM/YYYY HH:mm")}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Bảng điều khiển sinh viên</Title>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số nhiệm vụ"
              value={countTaskTotal}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Nhiệm vụ đã hoàn thành"
              value={countTaskCompleted}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Nhiệm vụ sắp tới"
              value={countTaskToDo}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Nhiệm vụ đang thực hiện"
              value={countTaskDoing}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Đồ án đang thực hiện" style={{ height: "100%" }}>
            {requestLoading ? (
              <Text>Đang tải dữ liệu...</Text>
            ) : requestData ? (
              <>
                <Space
                  style={{ width: "100%" }}
                  direction="vertical"
                  size="small"
                >
                  <Text strong>
                    Tên đề tài:{" "}
                    {requestData.thesis.title || "Chưa có tên đề tài"}
                  </Text>
                  <Text strong>
                    Giảng viên hướng dẫn:{" "}
                    {requestData.lecturer.name +
                      " - " +
                      requestData.lecturer.email || "Chưa có giảng viên"}
                  </Text>

                  <Text strong>Tiến trình thực hiện:</Text>
                  <Progress
                    percent={
                      countTaskTotal
                        ? Math.round(
                            (countTaskCompleted / countTaskTotal) * 100
                          )
                        : 0
                    }
                    status="active"
                  />
                </Space>
              </>
            ) : (
              <Text>Không có dữ liệu đề tài</Text>
            )}
          </Card>
        </Col>

        {/* Deadline sắp tới */}
        <Col xs={24} lg={12}>
          <Card title="Nhiệm vụ cần làm" style={{ height: "100%" }}>
            <Table
              dataSource={requestData?.tasks.filter(
                (task) =>
                  task.status === TASK_STATUS.TO_DO ||
                  task.status === TASK_STATUS.IN_PROGRESS
              )}
              columns={upcomingDeadlinesColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
