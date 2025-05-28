/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
} from "antd";
import { useMemo, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getRequestsAll,
  updateRequestStatus,
  type AllRequestResponse,
} from "@/services/api/request";
import {
  REQUEST_STATUS,
  THESIS_STATUS,
  THESIS_STATUS_LABELS,
} from "@/lib/constants";
import dayjs from "dayjs";

const { TextArea } = Input;

const ApproveRequests = () => {
  const {
    data: requestData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["request-all"],
    queryFn: () => getRequestsAll(),
  });

  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [selectedRejectType, setSelectedRejectType] = useState("");
  const [feedbackForm] = Form.useForm();

  const defaultStatuses = Object.values(THESIS_STATUS).filter(
    (status) => status !== THESIS_STATUS.CANCEL
  );
  const [selectedStatuses, setSelectedStatuses] =
    useState<string[]>(defaultStatuses);

  const filteredRequests = useMemo(() => {
    if (!requestData) return [];
    return requestData.filter((request) =>
      selectedStatuses.includes(request.status)
    );
  }, [requestData, selectedStatuses]);
  const handleApprove = async (id: number) => {
    try {
      await updateRequestStatus(id, {
        status: REQUEST_STATUS.IN_PROGRESS,
        rejectReason: "",
      });
      message.success("Duyệt thành công!");
      refetch();
    } catch (err) {
      message.error("Duyệt thất bại!");
    }
  };

  const handleReject = async ({
    id,
    feedback,
    rejectType,
  }: {
    id: number | null;
    feedback: string;
    rejectType: string;
  }) => {
    if (!id || !rejectType) return;

    try {
      await updateRequestStatus(id, {
        rejectReason: feedback,
        status: rejectType,
      });
      message.success("Từ chối thành công!");
      setIsRejectModalVisible(false);
      setSelectedRejectType("");
      feedbackForm.resetFields();
      refetch();
    } catch (err) {
      message.error("Từ chối thất bại!");
    }
  };

  const columns = [
    {
      title: "Sinh viên",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "Giáo viên hướng dẫn",
      dataIndex: "lecturer_name",
      key: "lecturer_name",
    },
    {
      title: "Đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "create_at",
      key: "create_at",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: AllRequestResponse["status"]) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label ?? "Không xác định";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record: AllRequestResponse) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.request_id)}
            disabled={
              record.status === REQUEST_STATUS.REVOKE ||
              record.status === REQUEST_STATUS.IN_PROGRESS ||
              record.status === REQUEST_STATUS.ADMIN_REJECT ||
              record.status === REQUEST_STATUS.CANCEL
            }
          >
            Duyệt
          </Button>
          <Button
            type="link"
            danger
            icon={<CloseOutlined />}
            disabled={
              record.status === REQUEST_STATUS.REVOKE ||
              record.status === REQUEST_STATUS.IN_PROGRESS ||
              record.status === REQUEST_STATUS.ADMIN_REJECT ||
              record.status === REQUEST_STATUS.CANCEL
            }
            onClick={() => {
              setSelectedRequestId(record.request_id);
              handleReject({
                id: record.request_id,
                feedback: "",
                rejectType: REQUEST_STATUS.ADMIN_REJECT,
              });
            }}
          >
            Từ chối
          </Button>
          <Button
            onClick={() => {
              setSelectedRequestId(record.request_id);
              setIsRejectModalVisible(true);
            }}
            style={
              record.status === REQUEST_STATUS.CANCEL
                ? {}
                : { backgroundColor: "red", color: "white" }
            }
            type="link"
            disabled={record.status === REQUEST_STATUS.CANCEL}
          >
            Hủy tư cách
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Quản lý yêu cầu đăng ký đề tài và giáo viên hướng dẫn">
        <Checkbox.Group
          options={Object.entries(THESIS_STATUS_LABELS).map(
            ([value, label]) => ({
              label,
              value,
            })
          )}
          value={selectedStatuses}
          onChange={(checkedValues) =>
            setSelectedStatuses(checkedValues as string[])
          }
          style={{ marginBottom: 16, display: "block" }}
        />

        <Table
          columns={columns}
          dataSource={filteredRequests || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={isLoading}
        />
      </Card>

      <Modal
        title="Từ chối yêu cầu"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setSelectedRejectType("");
          feedbackForm.resetFields();
        }}
        onOk={() => feedbackForm.submit()}
        okText="Gửi phản hồi"
        cancelText="Hủy"
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={(values) => {
            handleReject({
              id: selectedRequestId,
              feedback: values.feedback,
              rejectType: REQUEST_STATUS.REVOKE,
            });
          }}
        >
          <Form.Item
            name="feedback"
            label="Phản hồi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lý do từ chối",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApproveRequests;
