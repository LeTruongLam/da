import {
  Card,
  Table,
  Button,
  Pagination,
  Alert,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyTheses,
  deleteThesis,
  updateThesis,
  getThesisById,
} from "@/services/api/thesis";
import type {
  ThesisDetailResponse,
  ThesisResponse,
} from "@/services/api/thesis";
import { THESIS_STATUS, THESIS_STATUS_LABELS } from "@/lib/constants";
import dayjs from "dayjs";
import CreateThesisModal from "./CreateThesisModal";

const ThesisManagement = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  // State quản lý modal xem chi tiết
  const [selectedThesisId, setSelectedThesisId] = useState<number | null>(null);

  // State quản lý modal chỉnh sửa
  const [editingThesisId, setEditingThesisId] = useState<number | null>(null);

  // Dữ liệu đề tài được chọn để sửa
  const [editingThesis, setEditingThesis] =
    useState<ThesisDetailResponse | null>(null);

  // Danh sách đề tài của user
  const {
    data: theses = [],
    isLoading,
    refetch,
  } = useQuery<ThesisResponse[]>({
    queryKey: ["myTheses"],
    queryFn: getMyTheses,
  });

  // Lấy dữ liệu chi tiết đề tài xem chi tiết
  const {
    data: thesisDetail,
    isFetching: isFetchingDetail,
    refetch: refetchThesisDetail,
  } = useQuery({
    queryKey: ["thesisDetail", selectedThesisId],
    queryFn: () => getThesisById(selectedThesisId!),
    enabled: !!selectedThesisId,
  });

  // Xóa đề tài
  const deleteMutation = useMutation({
    mutationFn: deleteThesis,
    onSuccess: () => {
      message.success("Xóa đề tài thành công");
      queryClient.invalidateQueries({ queryKey: ["myTheses"] });
    },
    onError: () => {
      message.error("Xóa đề tài thất bại");
    },
  });

  // Cập nhật đề tài
  const { mutate: updateThesisMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ thesisId, data }: { thesisId: number; data: any }) =>
      updateThesis(thesisId, data),
    onSuccess: () => {
      message.success("Cập nhật đề tài thành công");
      queryClient.invalidateQueries({ queryKey: ["myTheses"] });
      closeEditModal();
    },
    onError: () => {
      message.error("Cập nhật đề tài thất bại");
    },
  });

  // Khi có dữ liệu chi tiết sửa, set form và state editingThesis
  useEffect(() => {
    if (thesisDetail) {
      form.setFieldsValue({
        title: thesisDetail.title,
        description: thesisDetail.description,
        status: thesisDetail.status,
      });
      setEditingThesis(thesisDetail);
    }
  }, [thesisDetail, form]);

  // Mở modal xem chi tiết
  const openViewModal = (thesisId: number) => {
    setSelectedThesisId(thesisId);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (thesisId: number) => {
    setEditingThesisId(thesisId);
  };

  // Đóng modal chỉnh sửa
  const closeEditModal = () => {
    setEditingThesisId(null);
    setEditingThesis(null);
    form.resetFields();
  };

  // Đóng modal xem chi tiết
  const closeViewModal = () => {
    setSelectedThesisId(null);
  };

  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      if (editingThesis) {
        updateThesisMutation({
          thesisId: editingThesis.thesis_id,
          data: {
            title: values.title,
            description: values.description,
            status: values.status,
          },
        });
      }
    });
  };

  const handleDelete = (thesisId: number) => {
    Modal.confirm({
      title: "Xác nhận xóa đề tài",
      content: "Bạn có chắc chắn muốn xóa đề tài này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteMutation.mutate(thesisId);
      },
    });
  };

  const paginatedData = theses.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label || "Không xác định";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: ThesisResponse) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record.thesis_id)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record.thesis_id)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            disabled={record.status === THESIS_STATUS.IN_PROGRESS}
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.thesis_id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Quản lý đồ án"
        extra={
          <Button type="primary" onClick={() => setCreateModalOpen(true)}>
            Tạo mới đề tài
          </Button>
        }
      >
        <Alert
          message="Lưu ý: Mỗi đề tài chỉ được phép gán cho một sinh viên"
          description="Nếu đề tài đã có sinh viên đăng ký, bạn không thể thêm sinh viên khác vào đề tài này."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="thesis_id"
          scroll={{ x: "max-content" }}
          loading={isLoading}
        />

        <Pagination
          current={current}
          pageSize={pageSize}
          total={theses.length}
          onChange={(page) => setCurrent(page)}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrent(current);
          }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} đề tài`}
          style={{ marginTop: 16, textAlign: "right" }}
        />
      </Card>

      {/* Modal sửa */}
      <Modal
        open={!!editingThesisId}
        title="Chỉnh sửa đề tài"
        onCancel={closeEditModal}
        onOk={handleEditSubmit}
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              {Object.entries(THESIS_STATUS_LABELS).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        open={!!selectedThesisId && !editingThesisId}
        title="Chi tiết đề tài"
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            Đóng
          </Button>,
        ]}
      >
        {isFetchingDetail ? (
          <p>Đang tải...</p>
        ) : thesisDetail ? (
          <>
            <p>
              <strong>Tiêu đề: </strong> {thesisDetail.title}
            </p>
            <p>
              <strong>Mô tả: </strong> {thesisDetail.description}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              {THESIS_STATUS_LABELS[
                thesisDetail.status as keyof typeof THESIS_STATUS_LABELS
              ] || "Không xác định"}
            </p>
            <p>
              <strong>Ngày tạo: </strong>
              {dayjs(thesisDetail.create_at).format("DD/MM/YYYY")}
            </p>
          </>
        ) : (
          <p>Không tìm thấy dữ liệu đề tài</p>
        )}
      </Modal>

      <CreateThesisModal
        refetch={refetch}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default ThesisManagement;
