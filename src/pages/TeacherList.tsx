import { useState } from "react";
import {
  Card,
  List,
  Avatar,
  Input,
  Space,
  Tag,
  Typography,
  Button,
  Modal,
  Row,
  Col,
  Statistic,
  Divider,
  Descriptions,
  Badge,
  message,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  BookOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

const { Title, Text, Paragraph } = Typography;

// Define the teacher type
interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  expertise: string;
  thesisCount: number;
  availableSlots: number;
}

const TeacherList = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch teachers data
  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: api.getTeachers,
  });

  // Filter teachers based on search text
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.expertise.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show teacher details modal
  const showTeacherDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalVisible(true);
  };

  const getAvailabilityTag = (availableSlots: number) => {
    if (availableSlots === 0) {
      return <Tag color="red">Đã đủ slot</Tag>;
    } else if (availableSlots < 2) {
      return <Tag color="orange">Còn {availableSlots} slot</Tag>;
    } else {
      return <Tag color="green">Còn {availableSlots} slots</Tag>;
    }
  };

  // Organize expertise into tags
  const renderExpertiseTags = (expertise: string) => {
    return expertise.split(", ").map((item, index) => (
      <Tag color="blue" key={index} style={{ margin: "2px" }}>
        {item}
      </Tag>
    ));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Card
        title={
          <Title level={4}>
            <TeamOutlined /> Danh sách giảng viên
          </Title>
        }
        extra={
          <Input
            placeholder="Tìm kiếm giảng viên..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        }
      >
        <List
          loading={isLoading}
          itemLayout="vertical"
          dataSource={filteredTeachers}
          renderItem={(teacher) => (
            <List.Item
              key={teacher.id}
              actions={[
                <Space key="expertise">
                  <ExperimentOutlined />{" "}
                  {renderExpertiseTags(teacher.expertise)}
                </Space>,
                <Space key="theses">
                  <BookOutlined /> {teacher.thesisCount} đề tài
                </Space>,
                <Space key="availability">
                  <TeamOutlined /> {getAvailabilityTag(teacher.availableSlots)}
                </Space>,
              ]}
              extra={
                <Button
                  type="primary"
                  onClick={() => showTeacherDetails(teacher)}
                >
                  Chi tiết
                </Button>
              }
            >
              <List.Item.Meta
                avatar={<Avatar size={64} icon={<UserOutlined />} />}
                title={
                  <Space>
                    <Text strong style={{ fontSize: 18 }}>
                      {teacher.name}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical">
                    <Space>
                      <BankOutlined /> {teacher.department}
                    </Space>
                    <Space>
                      <MailOutlined /> {teacher.email}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
        />
      </Card>

      {/* Modal chi tiết giảng viên */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            {selectedTeacher?.name}
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="contact"
            type="primary"
            onClick={() => {
              message.success("Chức năng liên hệ đang được phát triển");
              setIsModalVisible(false);
            }}
          >
            Liên hệ
          </Button>,
        ]}
        width={700}
      >
        {selectedTeacher && (
          <div>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: "center" }}>
                  <Avatar size={100} icon={<UserOutlined />} />
                  <Title level={5} style={{ marginTop: 16, marginBottom: 4 }}>
                    {selectedTeacher.name}
                  </Title>
                  <Text type="secondary">{selectedTeacher.department}</Text>

                  <Divider />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Đề tài"
                        value={selectedTeacher.thesisCount}
                        prefix={<BookOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Slots trống"
                        value={selectedTeacher.availableSlots}
                        prefix={<TeamOutlined />}
                        valueStyle={{
                          color:
                            selectedTeacher.availableSlots === 0
                              ? "#cf1322"
                              : selectedTeacher.availableSlots < 2
                              ? "#fa8c16"
                              : "#3f8600",
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={24} md={16}>
                <Descriptions title="Thông tin liên hệ" bordered>
                  <Descriptions.Item label="Email" span={3}>
                    <Space>
                      <MailOutlined />
                      {selectedTeacher.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại" span={3}>
                    <Space>
                      <PhoneOutlined />
                      {selectedTeacher.phone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Khoa/Bộ môn" span={3}>
                    <Space>
                      <BankOutlined />
                      {selectedTeacher.department}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 24 }}>
                  <Title level={5}>
                    <ExperimentOutlined /> Chuyên môn
                  </Title>
                  <div>{renderExpertiseTags(selectedTeacher.expertise)}</div>
                </div>
              </Col>
            </Row>

            <Divider />

            <Badge.Ribbon text="Thông tin đề tài" color="blue">
              <Card>
                <Paragraph>
                  Giảng viên này hiện đang hướng dẫn{" "}
                  {selectedTeacher.thesisCount} đề tài và còn{" "}
                  {selectedTeacher.availableSlots} slot cho sinh viên đăng ký
                  mới.
                </Paragraph>
                {selectedTeacher.availableSlots > 0 ? (
                  <Paragraph>
                    Vui lòng xem danh sách đề tài của giảng viên hoặc liên hệ
                    trực tiếp để biết thêm thông tin chi tiết về đề tài mà giảng
                    viên đang cung cấp.
                  </Paragraph>
                ) : (
                  <Paragraph type="warning">
                    Giảng viên hiện đã đủ số lượng sinh viên hướng dẫn. Vui lòng
                    chọn giảng viên khác hoặc liên hệ sau.
                  </Paragraph>
                )}
              </Card>
            </Badge.Ribbon>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherList;
