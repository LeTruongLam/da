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
  notification,
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
import { useNavigate } from "react-router-dom";
import { getAllTheses, getMyTheses } from "@/services/api/thesis";
import type { ThesisResponse } from "@/services/api/thesis";
import { formatDate } from "@/lib/ultils";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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

const _renderContent = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Paragraph>
      <Text strong>{title}: </Text>
      {content || "--"}
    </Paragraph>
  );
};

const ThesisList = () => {
  // States
  const [searchAllTheses, setSearchAllTheses] = useState("");
  const [searchMyTheses, setSearchMyTheses] = useState("");
  const [selectedThesis, setSelectedThesis] = useState<ThesisResponse | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
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
      if (!user?.userId) return [];
      try {
        const response = await getMyTheses();
        return response;
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách đồ án. Vui lòng thử lại sau!",
        });
        return [];
      }
    },
    enabled: !!user?.userId,
  });

  console.log("myTheses", myTheses);

  // Filter theses based on search text
  const filteredAllTheses = allTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchAllTheses.toLowerCase()) ||
      thesis.description
        .toLowerCase()
        .includes(searchAllTheses.toLowerCase()) ||
      thesis.lecturer.name
        .toLowerCase()
        .includes(searchAllTheses.toLowerCase()) ||
      thesis.major.majorName
        .toLowerCase()
        .includes(searchAllTheses.toLowerCase())
  );

  // Filter my theses based on search text
  const filteredMyTheses = myTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchMyTheses.toLowerCase()) ||
      thesis.description.toLowerCase().includes(searchMyTheses.toLowerCase()) ||
      thesis.lecturer.name
        .toLowerCase()
        .includes(searchMyTheses.toLowerCase()) ||
      thesis.major.majorName
        .toLowerCase()
        .includes(searchMyTheses.toLowerCase())
  );

  // Handle registering for a thesis
  const handleRegister = async () => {
    if (!selectedThesis || !user) return;

    try {
      // Replace API call with mock implementation
      // Mock successful registration
      setTimeout(() => {
        setIsModalVisible(false);
        setIsConfirmModalVisible(false);
        notification.success({
          message: "Thành công",
          description: "Đăng ký đề tài thành công!",
        });
      }, 500);
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi đăng ký đề tài!",
      });
    }
  };

  const showConfirmModal = () => {
    setIsConfirmModalVisible(true);
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
      render: (text: string) => <Text>{text || "--"}</Text>,
    },
    {
      title: "Giảng viên hướng dẫn",
      dataIndex: "lecturer",
      key: "lecturer",
      render: (lecturer: ThesisResponse["lecturer"]) => (
        <Space>{lecturer.name || "--"}</Space>
      ),
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      render: (major: ThesisResponse["major"]) => (
        <Space>
          <BookOutlined />
          {major.majorName || "--"}
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
                placeholder="Tìm kiếm theo tên đề tài, mô tả, giảng viên hoặc chuyên ngành..."
                prefix={<SearchOutlined />}
                style={{ width: 400 }}
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
                placeholder="Tìm kiếm theo tên đề tài, mô tả, giảng viên hoặc chuyên ngành..."
                prefix={<SearchOutlined />}
                style={{ width: 400 }}
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
          <Button key="register" type="primary" onClick={showConfirmModal}>
            Đăng ký
          </Button>,
        ]}
        width={800}
      >
        {selectedThesis && (
          <div>
            <Row style={{ marginBottom: 16 }} gutter={[16, 24]}>
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
                        <Paragraph>
                          <Text strong>Email: </Text>
                          {selectedThesis.lecturer.email}
                        </Paragraph>
                      </div>
                    </div>
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
                    {_renderContent({
                      title: "Mô tả",
                      content: selectedThesis.description,
                    })}
                    <Row gutter={16}>
                      <Col span={12}>
                        {_renderContent({
                          title: "Ngành",
                          content: selectedThesis.major.majorName,
                        })}
                      </Col>
                    </Row>
                    <Paragraph>
                      <Text strong>Trạng thái: </Text>
                      {getStatusTag(selectedThesis.status)}
                    </Paragraph>
                    <Paragraph>
                      {_renderContent({
                        title: "Ngày tạo",
                        content: formatDate(selectedThesis.createAt),
                      })}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>

            <div>
              <Badge.Ribbon
                text="Thông tin quan trọng"
                color="blue"
                placement="start"
              >
                <Card>
                  <Paragraph style={{ marginTop: 16 }}>
                    Sinh viên vui lòng đọc kỹ thông tin đề tài trước khi đăng
                    ký. Sau khi đăng ký, giảng viên sẽ xem xét và phản hồi trong
                    vòng 48 giờ.
                  </Paragraph>
                </Card>
              </Badge.Ribbon>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal xác nhận đăng ký */}
      <Modal
        title="Xác nhận đăng ký"
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsConfirmModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleRegister}>
            Xác nhận
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn đăng ký đề tài "{selectedThesis?.title}"?</p>
        <p>
          Lưu ý: Sau khi đăng ký, giảng viên sẽ xem xét và phản hồi trong vòng
          48 giờ.
        </p>
      </Modal>
    </div>
  );
};

export default ThesisList;
