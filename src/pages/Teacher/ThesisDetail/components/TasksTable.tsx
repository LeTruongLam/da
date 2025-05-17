import { Table, Button, Space, Card } from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/ui";

export interface SubTask {
  key: string;
  name: string;
  description?: string;
  startDate: string;
  deadline: string;
  status?: "not_started" | "in_progress" | "completed" | "late" | string;
}

interface Student {
  submittedTasks: SubTask[];
}

interface TasksTableProps {
  tasks: SubTask[];
  student?: Student | null;
  onAddTask: () => void;
  onEditTask: (task: SubTask) => void;
  onDeleteTask: (task: SubTask) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  student,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Card
      title="Các công việc"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTask}>
          Thêm công việc
        </Button>
      }
    >
      <Table
        columns={[
          {
            title: "Tên công việc",
            dataIndex: "name",
            key: "name",
            render: (text) => (
              <Space>
                <FileTextOutlined />
                {text}
              </Space>
            ),
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
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            width: 300,
          },
          {
            title: "Trạng thái",
            key: "status",
            render: (_, record) => {
              const studentTask = student?.submittedTasks?.find(
                (task) => task.key === record.key
              );
              return studentTask ? (
                <StatusTag type="task" status={studentTask.status || ""} />
              ) : (
                <StatusTag type="task" status="not_started" />
              );
            },
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
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
                  onClick={() => onDeleteTask(record)}
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
  );
};

export default TasksTable;
