/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  Table,
  Button,
  message,
  Modal,
  Flex,
  Descriptions,
  Spin,
} from "antd";
import { useState } from "react";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCouncil,
  getAllCouncils,
  deleteCouncil,
  getCouncilById,
  type Council,
  type CouncilById,
} from "@/services/api/councils";
import dayjs from "dayjs";

const CommitteeManagement = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<CouncilById | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Lấy danh sách tất cả các hội đồng
  const {
    data: allCouncils = [],
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["get-all-councils"],
    queryFn: () => getAllCouncils(),
  });

  // Tạo hội đồng
  const { mutate: createCouncilMutation, isPending: isCreating } = useMutation({
    mutationFn: createCouncil,
    onSuccess: () => {
      message.success("Tạo hội đồng bảo vệ thành công");
      refetchAll();
    },
    onError: () => message.error("Tạo hội đồng bảo vệ thất bại"),
  });

  // Xóa hội đồng
  const { mutate: deleteCouncilMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCouncil,
    onSuccess: () => {
      message.success("Xóa hội đồng thành công");
      refetchAll();
    },
    onError: () => {
      message.error("Xóa hội đồng thất bại");
    },
  });

  const handleCreateCouncil = () => {
    createCouncilMutation();
  };

  const handleDeleteCouncil = (id: number) => {
    modal.confirm({
      title: "Xác nhận xóa hội đồng?",
      content: "Hành động này sẽ không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true, loading: isDeleting },
      onOk: () => deleteCouncilMutation(id),
    });
  };

  const handleViewDetail = async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const data = await getCouncilById(id);
      setDetailData(data as CouncilById);
      setIsDetailVisible(true);
    } catch (error) {
      message.error("Lấy chi tiết hội đồng thất bại");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setDetailData(null);
  };

  const renderColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "thesis_title",
      key: "thesis_title",
    },
    {
      title: "Thời gian bảo vệ",
      dataIndex: "date",
      width: 150,
      key: "date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ bảo vệ",
      dataIndex: "time_to",
      key: "time_to",
      width: 150,
    },
    {
      title: "Nơi bảo vệ",
      dataIndex: "room",
      width: 150,
      key: "room",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: any, record: Council) => (
        <Flex gap={8}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.council_id)}
          >
            Xem chi tiết
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleDeleteCouncil(record.council_id)}
          >
            Xóa
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <Card title="Quản lý hội đồng bảo vệ">
      {contextHolder}
      <Flex justify="end" align="center" className="mb-4">
        <Button
          type="primary"
          loading={isCreating}
          onClick={handleCreateCouncil}
          style={{ marginBottom: 16 }}
        >
          Phân bổ hội đồng bảo vệ
        </Button>
      </Flex>
      <Table
        columns={renderColumns()}
        dataSource={allCouncils}
        rowKey="id"
        loading={isLoadingAll}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={isDetailVisible}
        title="Chi tiết hội đồng"
        onCancel={handleCloseDetail}
        footer={null}
      >
        {isLoadingDetail ? (
          <Spin />
        ) : detailData ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Ngày bảo vệ">
              {dayjs(detailData.date).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ bảo vệ">
              {detailData.time_to}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng">
              {detailData.room}
            </Descriptions.Item>
            <Descriptions.Item label="Danh sách hội đồng">
              <ul style={{ paddingLeft: 16 }}>
                {detailData.members.map((user) => (
                  <li key={user.user_id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>
    </Card>
  );
};

export default CommitteeManagement;
