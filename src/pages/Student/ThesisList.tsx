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
  InfoCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { getAllTheses } from "@/services/api/thesis";
import type { ThesisResponse } from "@/services/api/thesis";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ThesisList = () => {
  // States
  const [searchAllTheses, setSearchAllTheses] = useState("");
  const [searchMyTheses, setSearchMyTheses] = useState("");
  const [selectedThesis, setSelectedThesis] = useState<ThesisResponse | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // Fetch theses data
  const { data: allTheses = [], isLoading: isLoadingAll } = useQuery<
    ThesisResponse[]
  >({
    queryKey: ["theses"],
    queryFn: () => getAllTheses(),
  });

  // Fetch my theses data
  const { data: myTheses = [], isLoading: isLoadingMy } = useQuery<
    ThesisResponse[]
  >({
    queryKey: ["myTheses", user?.userId],
    queryFn: async () => {
      const response = await api.getMyTheses(user?.userId || "");
      return response.map((thesis) => ({
        thesisId: parseInt(thesis.id),
        title: thesis.title,
        description: thesis.description,
        status: thesis.status as ThesisResponse["status"],
        lecturer: {
          userId: thesis.supervisor.id,
          name: thesis.supervisor.name,
          email: thesis.supervisor.email,
        },
        major: {
          majorId: "1", // These would come from the API in a real implementation
          majorName: thesis.supervisor.department,
          facultyId: "1",
          facultyName: thesis.supervisor.department,
        },
        createdAt: thesis.createdAt,
      }));
    },
    enabled: !!user?.userId,
  });

  // Filter theses based on search text
  const filteredAllTheses = allTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchAllTheses.toLowerCase()) ||
      thesis.description.toLowerCase().includes(searchAllTheses.toLowerCase())
  );

  // Filter my theses based on search text
  const filteredMyTheses = myTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchMyTheses.toLowerCase()) ||
      thesis.lecturer.name
        .toLowerCase()
        .includes(searchMyTheses.toLowerCase()) ||
      thesis.description.toLowerCase().includes(searchMyTheses.toLowerCase())
  );

  // Handle registering for a thesis
  const handleRegister = async () => {
    if (!selectedThesis || !user) return;

    try {
      await api.registerThesis(selectedThesis.thesisId.toString(), user.userId);
      setIsModalVisible(false);
      message.success("Đăng ký đề tài thành công!");
    } catch {
      message.error("Đã xảy ra lỗi khi đăng ký đề tài!");
    }
  };

  // View thesis detail
  const viewThesisDetail = (thesis: ThesisResponse) => {
    navigate(`/my-thesis/${thesis.thesisId}`);
  };

  // Show thesis details modal
  const showThesisDetails = (thesis: ThesisResponse) => {
    setSelectedThesis(thesis);
    setIsModalVisible(true);
  };

  const getStatusTag = (status: ThesisResponse["status"]) => {
    const statusConfig = {
      available: { color: "processing", text: "Đang mở" },
      in_progress: { color: "processing", text: "Đang thực hiện" },
      completed: { color: "success", text: "Hoàn thành" },
      "not available": { color: "default", text: "Không khả dụng" },
      "on hold": { color: "warning", text: "Tạm hoãn" },
    };

    const config = statusConfig[status] || {
      color: "default",
      text: "Không xác định",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Giảng viên hướng dẫn",
      dataIndex: "lecturer",
      key: "lecturer",
      render: (lecturer: ThesisResponse["lecturer"]) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {lecturer.name}
        </Space>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      render: (major: ThesisResponse["major"]) => (
        <Space>
          <BookOutlined />
          {major.majorName}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ThesisResponse["status"]) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: ThesisResponse) => (
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
      dataIndex: "lecturer",
      key: "lecturer",
      render: (lecturer: ThesisResponse["lecturer"]) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {lecturer.name}
        </Space>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      render: (major: ThesisResponse["major"]) => (
        <Space>
          <BookOutlined />
          {major.majorName}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ThesisResponse["status"]) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: ThesisResponse) => (
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
                rowKey="thesisId"
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
                rowKey="thesisId"
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
                        <Text strong>{selectedThesis.lecturer.name}</Text>
                        <br />
                        <Text type="secondary">
                          {selectedThesis.major.majorName}
                        </Text>
                      </div>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <Paragraph>
                      <Text strong>Email: </Text>
                      {selectedThesis.lecturer.email}
                    </Paragraph>
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
                          <Text strong>Ngành: </Text>
                          {selectedThesis.major.majorName}
                        </Paragraph>
                      </Col>
                      <Col span={12}>
                        <Paragraph>
                          <Text strong>Khoa: </Text>
                          {selectedThesis.major.facultyName}
                        </Paragraph>
                      </Col>
                    </Row>
                    <Paragraph>
                      <Text strong>Trạng thái: </Text>
                      {getStatusTag(selectedThesis.status)}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Ngày tạo: </Text>
                      {new Date(selectedThesis.createdAt).toLocaleDateString()}
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
