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
  Checkbox,
  Spin,
} from "antd";
import { useMemo, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
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
    queryKey: ["request-all-admin"],
    queryFn: getRequestsAll,
  });

  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [feedbackForm] = Form.useForm();

  const [isActionPending, setIsActionPending] = useState(false);

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

  const approveRequestMutation = useMutation({
    mutationFn: (id: number) =>
      updateRequestStatus(id, {
        status: REQUEST_STATUS.IN_PROGRESS,
        rejectReason: "",
      }),
    onMutate: () => setIsActionPending(true),
    onSuccess: () => {
      message.success("Duyệt thành công!");
      refetch();
    },
    onError: () => {
      refetch();
    },
    onSettled: () => setIsActionPending(false),
  });

  const rejectRequestMutation = useMutation({
    mutationFn: ({
      id,
      feedback,
      rejectType,
    }: {
      id: number;
      feedback: string;
      rejectType: string;
    }) =>
      updateRequestStatus(id, {
        rejectReason: feedback,
        status: rejectType,
      }),
    onMutate: () => setIsActionPending(true),
    onSuccess: () => {
      message.success("Thao tác thành công!");
      setIsRejectModalVisible(false);
      feedbackForm.resetFields();
      refetch();
    },
    onError: () => {
      message.error("Thao tác thất bại!");
      refetch();
    },
    onSettled: () => setIsActionPending(false),
  });

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
      render: (status: AllRequestResponse["status"]) =>
        THESIS_STATUS_LABELS[status] ?? "Không xác định",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: AllRequestResponse) => {
        const isDisabled =
          record.status === REQUEST_STATUS.REVOKE ||
          record.status === REQUEST_STATUS.IN_PROGRESS ||
          record.status === REQUEST_STATUS.ADMIN_REJECT ||
          record.status === REQUEST_STATUS.CANCEL;

        return (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => approveRequestMutation.mutate(record.request_id)}
              disabled={isDisabled}
            >
              Duyệt
            </Button>

            <Button
              type="link"
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                setSelectedRequestId(record.request_id);
                rejectRequestMutation.mutate({
                  id: record.request_id,
                  feedback: "",
                  rejectType: REQUEST_STATUS.ADMIN_REJECT,
                });
              }}
              disabled={isDisabled}
            >
              Từ chối
            </Button>

            <Button
              onClick={() => {
                setSelectedRequestId(record.request_id);
                setIsRejectModalVisible(true);
              }}
              type="link"
              style={
                record.status === REQUEST_STATUS.CANCEL
                  ? {}
                  : { backgroundColor: "red", color: "white" }
              }
              disabled={record.status === REQUEST_STATUS.CANCEL}
            >
              Hủy tư cách
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={isLoading || isActionPending}>
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
            dataSource={filteredRequests}
            rowKey="request_id"
            pagination={{ pageSize: 5 }}
            loading={false} // Vì đã có Spin bên ngoài
          />
        </Card>
      </Spin>

      <Modal
        title="Từ chối yêu cầu"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          feedbackForm.resetFields();
        }}
        onOk={() => feedbackForm.submit()}
        okText="Gửi phản hồi"
        cancelText="Hủy"
        confirmLoading={isActionPending}
      >
        <Form
          form={feedbackForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedRequestId) {
              rejectRequestMutation.mutate({
                id: selectedRequestId,
                feedback: values.feedback,
                rejectType: REQUEST_STATUS.REVOKE,
              });
            }
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
