import { TASK_STATUS_LABELS } from "@/lib/constants";
import type { RequestDetailResponse } from "@/services/api/request";
import {
  CommentOutlined,
  FileTextOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  message,
  Row,
  Space,
  Table,
  Typography,
  Modal,
  Form,
  Input,
  Alert,
  Upload,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

type OverviewPartProps = {
  requestData: RequestDetailResponse | undefined | null;
};

type TaskType = {
  task_id: number;
  task_name: string;
  status: string;
  due_date: string;
  feedback?: string;
};

const TaskPartComponent: React.FC<OverviewPartProps> = ({ requestData }) => {
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [submissionForm] = Form.useForm();

  const handleOpenModal = (task: TaskType) => {
    setSelectedTask(task);
    submissionForm.setFieldsValue({
      taskId: task.task_id,
      taskName: task.task_name,
    });
    setIsSubmissionModalVisible(true);
  };

  const handleSubmitTask = (values: any) => {
    console.log("Submitted values:", values);
    message.success("Nộp bài thành công!");
    setIsSubmissionModalVisible(false);
    submissionForm.resetFields();
  };

  const uploadProps = {
    beforeUpload: () => false,
    multiple: false,
  };

  const renderModal = () => (
    <Modal
      title={
        selectedTask ? `Nộp bài: ${selectedTask.task_name}` : "Nộp tài liệu mới"
      }
      open={isSubmissionModalVisible}
      onCancel={() => setIsSubmissionModalVisible(false)}
      footer={null}
    >
      <Form form={submissionForm} layout="vertical" onFinish={handleSubmitTask}>
        {selectedTask && (
          <>
            <Form.Item name="taskId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="taskName" hidden>
              <Input />
            </Form.Item>
            <Alert
              message={`Deadline: ${dayjs(selectedTask.due_date).format(
                "DD/MM/YYYY HH:mm"
              )}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </>
        )}

        <Form.Item
          name="file"
          label="Tải lên file"
          rules={[{ required: true, message: "Vui lòng tải lên file!" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList || []}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click hoặc kéo thả file vào khu vực này
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ các định dạng: PDF, DOC, DOCX, PPT, ZIP...
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Nộp bài
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Danh sách công việc">
            {requestData?.tasks && requestData.tasks.length > 0 ? (
              <Table
                dataSource={requestData.tasks}
                rowKey={(record) => record.task_id.toString()}
                columns={[
                  {
                    title: "Tên công việc",
                    dataIndex: "task_name",
                    key: "task_name",
                    render: (text) => (
                      <Space>
                        <FileTextOutlined />
                        <Text strong>{text}</Text>
                      </Space>
                    ),
                  },
                  {
                    title: "Deadline",
                    dataIndex: "due_date",
                    key: "due_date",
                    render: (value: string) =>
                      dayjs(value).format("DD/MM/YYYY HH:mm"),
                  },
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    render: (status: RequestDetailResponse["status"]) => {
                      const label =
                        TASK_STATUS_LABELS[
                          status as keyof typeof TASK_STATUS_LABELS
                        ];
                      return label ?? "Không xác định";
                    },
                  },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: (_, record: TaskType) => (
                      <Space>
                        {record.status !== "completed" && (
                          <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => handleOpenModal(record)}
                          >
                            Nộp bài
                          </Button>
                        )}
                        {record.feedback && (
                          <Button
                            type="link"
                            icon={<CommentOutlined />}
                            onClick={() => message.info(record.feedback)}
                          >
                            Nhận xét
                          </Button>
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="Chưa có nhiệm vụ nào được giao" />
            )}
          </Card>
        </Col>
      </Row>

      {renderModal()}
    </>
  );
};

export default TaskPartComponent;
