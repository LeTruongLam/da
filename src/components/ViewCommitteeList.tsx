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
import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCouncils,
  getCouncilById,
  type Council,
  type CouncilById,
} from "@/services/api/councils";
import dayjs from "dayjs";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

const ViewCommitteeListPage = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<CouncilById | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // Lấy danh sách tất cả các hội đồng
  const { data: allCouncils = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["get-all-councils", user],
    queryFn: () => getAllCouncils(),
  });

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
        </Flex>
      ),
    },
  ];

  return (
    <Card title="Quản lý hội đồng bảo vệ">
      {contextHolder}
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

export default ViewCommitteeListPage;
