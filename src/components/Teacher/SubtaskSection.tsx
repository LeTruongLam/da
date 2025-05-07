import React from "react";
import { Card, Button, Table, Space, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { styles, props } from "./styles";

interface SubTask {
  key: string;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  status?: "not_started" | "in_progress" | "completed" | "late";
  submittedAt?: string;
}

interface SubtaskSectionProps {
  subTasks: SubTask[];
  onAddSubtask: () => void;
  onEditSubtask: (subtask: SubTask) => void;
  onDeleteSubtask: (subtask: SubTask) => void;
}

const SubtaskSection: React.FC<SubtaskSectionProps> = ({
  subTasks,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
}) => {
  const getTaskStatusTag = (status?: string) => {
    if (!status) return <Tag>Chưa bắt đầu</Tag>;

    const statusConfig = {
      not_started: { color: "default", text: "Chưa bắt đầu" },
      in_progress: { color: "processing", text: "Đang thực hiện" },
      completed: { color: "success", text: "Hoàn thành" },
      late: { color: "error", text: "Trễ hạn" },
    };

    const { color, text } =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.not_started;

    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: unknown, record: SubTask) => getTaskStatusTag(record.status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: SubTask) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEditSubtask(record)}
            size={props.button.size}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteSubtask(record)}
            size={props.button.size}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Công việc (Subtasks)"
      style={styles.cardSpacing}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddSubtask}
          size={props.button.size}
        >
          Thêm công việc
        </Button>
      }
    >
      <div style={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={subTasks}
          pagination={false}
          rowKey="key"
          size={props.table.size}
        />
      </div>
    </Card>
  );
};

export default SubtaskSection;
