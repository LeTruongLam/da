import { TASK_STATUS, TASK_STATUS_LABELS } from "@/lib/constants";
import type { RequestDetailResponse } from "@/services/api/request";
import { uploadToCloudinary } from "@/lib/cloudinary";
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
  Timeline,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateTask } from "@/services/api/task";
import {
  getAllFeedbackByTaskId,
  type FeedbackResponse,
} from "@/services/api/feedback";

const { Text } = Typography;
const { Dragger } = Upload;

type TaskPartProps = {
  requestData: RequestDetailResponse | undefined | null;
  refetch: () => void;
};

type TaskType = {
  task_id: number;
  task_name: string;
  status: string;
  due_date: string;
  feedback?: string;
};

interface SubmissionFormValues {
  taskId: number;
  taskName: string;
  file: {
    originFileObj: File;
  }[];
}

const TaskPartComponent: React.FC<TaskPartProps> = ({
  requestData,
  refetch,
}) => {
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [submissionForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // Modal xem đánh giá
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackResponse[]>([]);

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: any }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      message.success("Nộp bài thành công!");
      setIsSubmissionModalVisible(false);
      submissionForm.resetFields();
      refetch();
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
      message.error("Có lỗi xảy ra khi nộp bài!");
    },
  });

  const handleOpenModal = (task: TaskType) => {
    setSelectedTask(task);
    submissionForm.setFieldsValue({
      taskId: task.task_id,
      taskName: task.task_name,
    });
    setIsSubmissionModalVisible(true);
  };

  const handleSubmitTask = async (values: SubmissionFormValues) => {
    try {
      setUploading(true);
      const file = values.file[0]?.originFileObj;
      if (!file) {
        message.error("Vui lòng chọn file để upload!");
        return;
      }

      const fileUploaded = await uploadToCloudinary(file, "tasks");

      const originalName = fileUploaded.original_filename;
      const extension = file.name.split(".").pop();
      const fileNameWithExtension = `${originalName}.${extension}`;

      const data = {
        file_name: fileNameWithExtension,
        file_path: fileUploaded.url,
        status: TASK_STATUS.IN_PROGRESS,
        due_date: selectedTask?.due_date,
      };

      updateTaskMutation({
        taskId: values.taskId,
        data,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Có lỗi xảy ra khi nộp bài!");
    } finally {
      setUploading(false);
    }
  };

  const handleViewFeedback = async (taskId: number) => {
    try {
      const data = await getAllFeedbackByTaskId(taskId);
      setFeedbackList(data);
      setIsFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error loading feedback:", error);
      message.error("Không thể tải danh sách nhận xét!");
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-rar-compressed",
        "image/jpeg",
        "image/png",
      ];

      const isAllowedType = allowedTypes.includes(file.type);
      if (!isAllowedType) {
        message.error(
          "Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, RAR, JPG, PNG!"
        );
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
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
              Hỗ trợ các định dạng: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP,
              RAR, JPG, PNG
              <br />
              Kích thước tối đa: 10MB
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={uploading}>
            Nộp bài
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderFeedbackModal = () => (
    <Modal
      title="Danh sách đánh giá"
      open={isFeedbackModalVisible}
      onCancel={() => setIsFeedbackModalVisible(false)}
      footer={null}
    >
      <div style={{ marginTop: 16 }}>
        {feedbackList.length > 0 ? (
          <Timeline
            mode="left"
            items={feedbackList.map((item) => ({
              label: dayjs(item.create_at).format("DD/MM/YYYY HH:mm"),
              children: (
                <div>
                  <Text strong>{item.sender_name}</Text>
                  <br />
                  <Text>{item.comment}</Text>
                </div>
              ),
            }))}
          />
        ) : (
          <Empty description="Chưa có đánh giá nào" />
        )}
      </div>
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
                        <Button
                          type="link"
                          icon={<CommentOutlined />}
                          onClick={() => handleViewFeedback(record.task_id)}
                        >
                          Xem đánh giá
                        </Button>
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
      {renderFeedbackModal()}
    </>
  );
};

export default TaskPartComponent;
