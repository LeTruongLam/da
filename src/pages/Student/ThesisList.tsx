import { useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  Typography,
  Row,
  Col,
  Badge,
  Avatar,
  Divider,
  message,
  Empty,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Thesis {
  id: string;
  title: string;
  description: string;
  supervisor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    expertise: string;
  };
  status: string;
  deadline: string;
  objectives: string;
  requirements: string;
  progress?: number;
  createdAt: string;
}

const ThesisList = () => {
  // States
  const [searchAllTheses, setSearchAllTheses] = useState("");
  const [searchMyTheses, setSearchMyTheses] = useState("");
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // Fetch theses data
  const { data: allTheses = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["theses"],
    queryFn: () => api.getTheses(),
  });

  // Fetch my theses data
  const { data: myTheses = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ["myTheses", user?.id],
    queryFn: () => api.getMyTheses(user?.id || ""),
    enabled: !!user?.id,
  });

  // Filter theses based on search text
  const filteredAllTheses = allTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchAllTheses.toLowerCase()) ||
      thesis.supervisor.name
        .toLowerCase()
        .includes(searchAllTheses.toLowerCase()) ||
      thesis.description.toLowerCase().includes(searchAllTheses.toLowerCase())
  );

  // Filter my theses based on search text
  const filteredMyTheses = myTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchMyTheses.toLowerCase()) ||
      thesis.supervisor.name
        .toLowerCase()
        .includes(searchMyTheses.toLowerCase()) ||
      thesis.description.toLowerCase().includes(searchMyTheses.toLowerCase())
  );

  // Handle registering for a thesis
  const handleRegister = async () => {
    if (!selectedThesis || !user) return;

    try {
      await api.registerThesis(selectedThesis.id, user.id);
      setIsModalVisible(false);
    } catch {
      message.error("Đã xảy ra lỗi khi đăng ký đề tài!");
    }
  };

  // View thesis detail
  const viewThesisDetail = (thesis: Thesis) => {
    navigate(`/my-thesis/${thesis.id}`);
  };

  // Show thesis details modal
  const showThesisDetails = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setIsModalVisible(true);
  };

  const getMonthsUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  };

  const getDeadlineTag = (deadline: string) => {
    const months = getMonthsUntilDeadline(deadline);

    if (months < 0) {
      return <Tag color="red">Đã hết hạn</Tag>;
    } else if (months < 2) {
      return <Tag color="volcano">Còn {months} tháng</Tag>;
    } else if (months < 6) {
      return <Tag color="orange">Còn {months} tháng</Tag>;
    } else {
      return <Tag color="green">Còn {months} tháng</Tag>;
    }
  };

  // Get columns for all theses
  const getAllThesesColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong style={{ fontSize: 16 }}>
          {text}
        </Text>
      ),
      ellipsis: true,
    },
    {
      title: "Giảng viên hướng dẫn",
      dataIndex: "supervisor",
      key: "supervisor",
      render: (supervisor: Thesis["supervisor"]) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {supervisor.name}
        </Space>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline: string) => (
        <Space>
          <CalendarOutlined />
          {deadline}
          {getDeadlineTag(deadline)}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Thesis) => (
        <Space>
          <Button type="primary" onClick={() => showThesisDetails(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Get columns for my theses
  const getMyThesesColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong style={{ fontSize: 16 }}>
          {text}
        </Text>
      ),
      ellipsis: true,
    },
    {
      title: "Giảng viên hướng dẫn",
      dataIndex: "supervisor",
      key: "supervisor",
      render: (supervisor: Thesis["supervisor"]) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {supervisor.name}
        </Space>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline: string) => (
        <Space>
          <CalendarOutlined />
          {deadline}
          {getDeadlineTag(deadline)}
        </Space>
      ),
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number = 0) => (
        <Space>
          <Tag
            color={
              progress > 70
                ? "success"
                : progress > 30
                ? "processing"
                : "warning"
            }
          >
            {progress}%
          </Tag>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Thesis) => (
        <Button type="primary" onClick={() => viewThesisDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card
        title={
          <Title level={4}>
            <BookOutlined /> Đồ án
          </Title>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tất cả đồ án" key="all">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <Input
                placeholder="Tìm kiếm đề tài..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                value={searchAllTheses}
                onChange={(e) => setSearchAllTheses(e.target.value)}
                allowClear
              />
            </div>
            {allTheses.length === 0 && !isLoadingAll ? (
              <Empty
                description="Không có đề tài nào khả dụng"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Table
                dataSource={filteredAllTheses}
                rowKey="id"
                loading={isLoadingAll}
                columns={getAllThesesColumns()}
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab="Đồ án của tôi" key="my">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <Input
                placeholder="Tìm kiếm đồ án của tôi..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                value={searchMyTheses}
                onChange={(e) => setSearchMyTheses(e.target.value)}
                allowClear
              />
            </div>
            {myTheses.length === 0 && !isLoadingMy ? (
              <Empty
                description="Bạn chưa đăng ký đề tài nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Table
                dataSource={filteredMyTheses}
                rowKey="id"
                loading={isLoadingMy}
                columns={getMyThesesColumns()}
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal chi tiết đề tài */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {selectedThesis?.title}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="register" type="primary" onClick={handleRegister}>
            Đăng ký
          </Button>,
        ]}
        width={800}
      >
        {selectedThesis && (
          <div>
            <Row gutter={[16, 24]}>
              {/* Thông tin giảng viên */}
              <Col xs={24} md={8}>
                <Card
                  title={
                    <Space>
                      <UserOutlined /> Giảng viên hướng dẫn
                    </Space>
                  }
                  size="small"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ textAlign: "center", margin: "10px 0" }}>
                      <Avatar size={64} icon={<UserOutlined />} />
                      <div style={{ marginTop: 8 }}>
                        <Text strong>{selectedThesis.supervisor.name}</Text>
                        <br />
                        <Text type="secondary">
                          {selectedThesis.supervisor.department}
                        </Text>
                      </div>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <Paragraph>
                      <Text strong>Email: </Text>
                      {selectedThesis.supervisor.email}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>SĐT: </Text>
                      {selectedThesis.supervisor.phone}
                    </Paragraph>
                    {/* <Paragraph>
                      <Text strong>Chuyên môn: </Text>
                      {selectedThesis.supervisor.expertise}
                    </Paragraph> */}
                  </Space>
                </Card>
              </Col>

              {/* Thông tin đề tài */}
              <Col xs={24} md={16}>
                <Card
                  title={
                    <Space>
                      <InfoCircleOutlined /> Thông tin đề tài
                    </Space>
                  }
                  size="small"
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Paragraph>
                      <Text strong>Mô tả: </Text>
                      {selectedThesis.description}
                    </Paragraph>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Paragraph>
                          <Text strong>
                            <QuestionCircleOutlined /> Yêu cầu:{" "}
                          </Text>
                          {selectedThesis.requirements}
                        </Paragraph>
                      </Col>
                      <Col span={12}>
                        <Paragraph>
                          <Text strong>
                            <ExperimentOutlined /> Mục tiêu:{" "}
                          </Text>
                          {selectedThesis.objectives}
                        </Paragraph>
                      </Col>
                    </Row>
                    <Paragraph>
                      <Text strong>
                        <CalendarOutlined /> Deadline:{" "}
                      </Text>
                      {selectedThesis.deadline}
                      {getDeadlineTag(selectedThesis.deadline)}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Badge.Ribbon
                text="Thông tin quan trọng"
                color="blue"
                placement="start"
              >
                <Card>
                  <Paragraph>
                    Sinh viên vui lòng đọc kỹ thông tin đề tài trước khi đăng
                    ký. Sau khi đăng ký, giảng viên sẽ xem xét và phản hồi trong
                    vòng 48 giờ.
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Lưu ý: </Text>
                    Mỗi sinh viên chỉ được đăng ký một đề tài. Việc thay đổi đề
                    tài sau khi đã được duyệt sẽ cần được xem xét và có thể ảnh
                    hưởng đến tiến độ của bạn.
                  </Paragraph>
                </Card>
              </Badge.Ribbon>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ThesisList;
