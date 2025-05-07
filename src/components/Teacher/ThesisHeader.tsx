import React from "react";
import { Card, Row, Col, Tag, Typography, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { styles, props } from "./styles";

const { Title, Text, Paragraph } = Typography;

interface Student {
  id: string;
  name: string;
  studentId: string;
  progress: number;
  rating: number;
  email?: string;
  phone?: string;
}

interface ThesisData {
  id: string;
  title: string;
  description: string;
  major: string;
  status: string;
  deadline: string;
  student: Student | null;
  requirements: string;
  objectives: string;
}

interface ThesisHeaderProps {
  thesis: ThesisData;
  openEditModal: () => void;
  openDeleteThesisModal: () => void;
  toggleThesisDemo?: () => void; // Optional for demo purposes
}

const statusColors: Record<string, string> = {
  "Có sẵn": "green",
  "Đang thực hiện": "blue",
  "Hoàn thành": "gray",
  "Đã hủy": "red",
};

const ThesisHeader: React.FC<ThesisHeaderProps> = ({
  thesis,
  openEditModal,
  openDeleteThesisModal,
  toggleThesisDemo,
}) => {
  return (
    <Card
      type="inner"
      title={<Title level={4}>{thesis.title}</Title>}
      extra={
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            size={props.button.size}
          >
            Chỉnh sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={openDeleteThesisModal}
            size={props.button.size}
          >
            Xóa
          </Button>
          {toggleThesisDemo && (
            <Button
              type="dashed"
              onClick={toggleThesisDemo}
              size={props.button.size}
            >
              {thesis.student ? "Demo: Không có SV" : "Demo: Có SV"}
            </Button>
          )}
        </Space>
      }
      style={styles.cardSpacing}
    >
      <Row gutter={styles.rowGutter}>
        <Col span={16}>
          <Paragraph>
            <Text strong>Mô tả: </Text>
            {thesis.description}
          </Paragraph>
          <Paragraph>
            <Text strong>Yêu cầu: </Text>
            {thesis.requirements}
          </Paragraph>
          <Paragraph>
            <Text strong>Mục tiêu: </Text>
            {thesis.objectives}
          </Paragraph>
        </Col>
        <Col span={8}>
          <Paragraph>
            <Text strong>Chuyên ngành: </Text>
            {thesis.major}
          </Paragraph>
          <Paragraph>
            <Text strong>Trạng thái: </Text>
            <Tag
              color={statusColors[thesis.status as keyof typeof statusColors]}
            >
              {thesis.status}
            </Tag>
          </Paragraph>
          <Paragraph>
            <Text strong>Deadline: </Text>
            {thesis.deadline}
          </Paragraph>
          <Paragraph>
            <Text strong>Số sinh viên: </Text>
            {thesis.student ? 1 : 0}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ThesisHeader;
