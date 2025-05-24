import { Card, List, Avatar, Space, Typography, Tag, Input } from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  MailOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getInternalLecturers,
  getExternalLecturers,
} from "@/services/api/teacher";
import type { TeacherResponse } from "@/services/api/teacher";
import { formatDate } from "@/lib/ultils";
import { THESIS_STATUS } from "@/lib/constants";
import { useState } from "react";

const { Title, Text } = Typography;

const TeacherList = () => {
  const [searchText, setSearchText] = useState("");
  const { data: internalLecturers = [], isLoading } = useQuery<
    TeacherResponse[]
  >({
    queryKey: ["internalLecturers"],
    queryFn: getInternalLecturers,
  });

  const {
    data: externalLecturers = [],
    isLoading: isExternalLecturersLoading,
  } = useQuery<TeacherResponse[]>({
    queryKey: ["externalLecturers"],
    queryFn: getExternalLecturers,
  });

  const filteredTeachers = [...internalLecturers, ...externalLecturers].filter(
    (teacher) => teacher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 0" }}>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            <TeamOutlined /> Danh sách giảng viên
          </Title>
        }
        bodyStyle={{ padding: "24px" }}
      >
        <Input
          placeholder="Tìm kiếm theo tên giảng viên..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 24, width: "300px" }}
          allowClear
        />

        <List
          loading={isLoading}
          itemLayout="vertical"
          dataSource={filteredTeachers}
          renderItem={(teacher) => (
            <List.Item
              key={teacher.user_id}
              style={{
                padding: "24px",
                marginBottom: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: 20 }}>
                      {teacher.name}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical" size="middle">
                    <Space>
                      <MailOutlined style={{ color: "#1890ff" }} />
                      <Text>{teacher.email}</Text>
                    </Space>
                    <Space>
                      <Tag color="blue">
                        {teacher.role_name === "inside lecturer"
                          ? "Giảng viên trong trường"
                          : "Giảng viên ngoài trường"}
                      </Tag>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            style: { marginTop: 24 },
          }}
        />
      </Card>
    </div>
  );
};

export default TeacherList;
