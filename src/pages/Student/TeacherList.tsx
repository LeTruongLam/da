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
import { getAllTeachers } from "@/services/api/teacher";
import type { TeacherResponse } from "@/services/api/teacher";
import { formatDate } from "@/lib/ultils";
import { THESIS_STATUS } from "@/lib/constants";
import { useState } from "react";

const { Title, Text } = Typography;

const TeacherList = () => {
  const [searchText, setSearchText] = useState("");
  const { data: teachers = [], isLoading } = useQuery<TeacherResponse[]>({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
  });

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase())
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
              key={teacher.userId}
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
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ marginTop: 16 }}
                  >
                    <Space>
                      <MailOutlined style={{ color: "#1890ff" }} />
                      <Text>{teacher.email}</Text>
                    </Space>
                    <div>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: 8 }}
                      >
                        Đề tài đang hướng dẫn:{" "}
                        {
                          teacher.theses.filter(
                            (thesis) =>
                              thesis.status === THESIS_STATUS.IN_PROGRESS
                          ).length
                        }{" "}
                        đề tài <BookOutlined />
                      </Text>
                      <Space wrap>
                        {teacher.theses
                          .filter(
                            (thesis) =>
                              thesis.status === THESIS_STATUS.IN_PROGRESS
                          )
                          .map((thesis) => (
                            <Tag
                              color="blue"
                              key={thesis.thesisId}
                              style={{
                                padding: "4px 8px",
                                margin: "4px",
                                borderRadius: "4px",
                              }}
                            >
                              <Space>
                                <BookOutlined />
                                <span>{thesis.title}</span>
                                <CalendarOutlined style={{ marginLeft: 4 }} />
                                <span>{formatDate(thesis.createAt)}</span>
                              </Space>
                            </Tag>
                          ))}
                      </Space>
                    </div>
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
