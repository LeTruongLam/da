import { Table, Button, Space, Tag, Card } from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TaskResponse } from "@/services/api/task";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import SubtaskModal from "./SubtaskModal";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface TasksTableProps {
  tasks: TaskResponse[];
  refetchTasks: () => void;
  tasksLoading: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  refetchTasks,
  tasksLoading,
}) => {
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onAddTask = () => {
    // Handle add task logic here
    setIsSubtaskModalVisible(true);
  };

  const onEditTask = (record: TaskResponse) => {
    // Handle edit task logic here
    return record;
  };

  const handleDeleteTask = () => {
    // Handle delete task logic here
  };


  return (
    <>
      <Card
        title="Các công việc"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
            Thêm công việc
          </Button>
        }
      >
        <Table
          loading={tasksLoading}
          columns={[
            {
              title: "Tên công việc",
              dataIndex: "name",
              key: "name",
              render: (text: string) => (
                <Space>
                  <FileTextOutlined />
                  {text}
                </Space>
              ),
            },
            {
              title: "Deadline",
              dataIndex: "deadline",
              key: "deadline",
              render: (deadline: string) => <span>{deadline}</span>,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status: string) => (
                <Tag
                  color={
                    status === "late"
                      ? "red"
                      : status === "completed"
                      ? "green"
                      : "blue"
                  }
                >
                  {TASK_STATUS_LABELS[status] || status}
                </Tag>
              ),
            },
            {
              title: "Thao tác",
              key: "action",
              render: (_, record: TaskResponse) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => onEditTask(record)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => setIsDeleteModalVisible(true)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={tasks}
          pagination={false}
          rowKey="key"
        />
      </Card>
      <SubtaskModal
        visible={isSubtaskModalVisible}
        subtask={null}
        onCancel={() => setIsSubtaskModalVisible(false)}
        refetchTasks={refetchTasks}
      />

      {/* Confirmation Modals */}
      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        title="Xác nhận xóa"
        description="Hành động này không thể hoàn tác."
        itemName={`công việc "123"`}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteTask}
      />
    </>
  );
};

export default TasksTable;
