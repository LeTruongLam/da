/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Typography,
  notification,
  Empty,
  Tabs,
  message,
  Modal,
} from "antd";
import { SearchOutlined, BookOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { getAllTheses, getMyTheses } from "@/services/api/thesis";
import type { ThesisResponse } from "@/services/api/thesis";
import CreateRequestModal from "@/components/modals/CreateRequestModal";
import {
  THESIS_STATUS,
  THESIS_STATUS_LABELS,
  USER_ROLES,
} from "@/lib/constants";
import RequestTab from "./Request.part";
import ThesisDetailModal from "./ThesisDetailModal";
import dayjs from "dayjs";
import { createRequest, type RequestDataRequest } from "@/services/api/request";
import SelectLecturerModal from "@/components/modals/SelectLecturerModal";
import { getUserById } from "@/services/api";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ThesisList = () => {
  // States
  const [searchAllTheses, setSearchAllTheses] = useState("");
  const [searchMyTheses, setSearchMyTheses] = useState("");

  const [isThesisDetailModalVisible, setIsThesisDetailModalVisible] =
    useState(false);
  const [selectedThesesId, setSelectedThesesId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreaCreateRequestTeacher, setIsCreateRequestTeacher] =
    useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const [isCreateRequestModalVisible, setIsCreateRequestModalVisible] =
    useState(false);

  const [isHaveRequestActive, setIsHaveRequestActive] = useState(false);

  // Fetch theses data
  const {
    data: allTheses = [],
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useQuery<ThesisResponse[]>({
    queryKey: ["theses"],
    queryFn: () => getAllTheses(),
  });

  // Fetch my theses data
  const {
    data: myTheses = [],
    isLoading: isLoadingMy,
    refetch,
  } = useQuery<ThesisResponse[]>({
    queryKey: ["myTheses", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      try {
        const response = await getMyTheses();
        return response;
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách đồ án. Vui lòng thử lại sau!",
        });
        return [];
      }
    },
    enabled: !!user?.user_id,
  });

  // Filter theses based on search text
  const filteredAllTheses = allTheses.filter(
    (thesis) =>
      thesis.title.toLowerCase().includes(searchAllTheses.toLowerCase()) &&
      thesis.role_name !== USER_ROLES.STUDENT
  );

  // Filter my theses based on search text
  const filteredMyTheses = myTheses.filter((thesis) =>
    thesis.title.toLowerCase().includes(searchMyTheses.toLowerCase())
  );

  const { data: userData } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      if (!user?.user_id) return undefined;
      return await getUserById(user.user_id);
    },
    enabled: !!user?.user_id, // Chỉ chạy khi có user_id
  });

  useEffect(() => {
    if (
      userData &&
      userData.currentRequest &&
      userData.currentRequest.status !== null
    ) {
      setIsHaveRequestActive(true);
    }
  }, [userData]);

  useEffect(() => {
    if (activeTab === "all") {
      refetchAll();
    } else if (activeTab === "my") {
      refetch();
    }
  }, [activeTab, refetchAll, refetch]);

  const { mutate: handleCreateRequestMutation } = useMutation({
    mutationFn: (data: RequestDataRequest) => createRequest(data),
  });
  // Get columns for all theses
  const getAllThesesColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong style={{ fontSize: 16 }}>
          {text}
        </Text>
      ),
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => {
        return dayjs(value).format("DD/MM/YYYY");
      },
    },
    {
      title: "Người tạo",
      dataIndex: "creator_name",
      key: "creator_name",
      render: (value: string) => <Space>{value || "--"}</Space>,
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: ThesisResponse["status"]) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label ?? "Không xác định";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: ThesisResponse) => (
        <Button
          hidden={record.status !== THESIS_STATUS.AVAILABLE}
          type="primary"
          disabled={isHaveRequestActive}
          onClick={() => {
            Modal.confirm({
              title: "Xác nhận gửi yêu cầu",
              content: `Bạn có chắc chắn muốn gửi yêu cầu đăng ký đề tài "${record.title}" không?`,
              okText: "Xác nhận",
              cancelText: "Hủy",
              onOk: async () => {
                try {
                  const value = {
                    thesis_id: record.thesis_id,
                    student_id: user?.user_id,
                    lecturer_id: record.create_by,
                  };
                  await handleCreateRequestMutation(value);
                  message.success("Gửi yêu cầu thành công!");
                } catch (error) {
                  message.error("Gửi yêu cầu thất bại");
                }
              },
            });
          }}
        >
          Gửi yêu cầu
        </Button>
      ),
    },
  ];

  // Get columns for my theses
  const getMyThesesColumns = () => [
    {
      title: "Tên đề tài",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong style={{ fontSize: 16 }}>
          {text}
        </Text>
      ),
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => {
        return dayjs(value).format("DD/MM/YYYY");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ThesisResponse["status"]) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label ?? "Không xác định";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: ThesisResponse) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setSelectedThesesId(record.thesis_id);
              setIsThesisDetailModalVisible(true);
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            disabled={
              record.status !== THESIS_STATUS.AVAILABLE || isHaveRequestActive
            }
            type="primary"
            onClick={() => {
              setIsCreateRequestTeacher(true);
              setSelectedThesesId(record.thesis_id);
            }}
          >
            Gửi yêu cầu
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ margin: "0 auto" }}>
      <Card
        title={
          <Title level={4}>
            <BookOutlined /> Đồ án
          </Title>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tất cả đồ án" key="all">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <Input
                placeholder="Tìm kiếm theo tên đề tài"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                value={searchAllTheses}
                onChange={(e) => setSearchAllTheses(e.target.value)}
                allowClear
              />
            </div>
            {allTheses.length === 0 && !isLoadingAll ? (
              <Empty
                description="Không có đề tài nào khả dụng"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Table
                dataSource={filteredAllTheses}
                rowKey="thesisId"
                loading={isLoadingAll}
                columns={getAllThesesColumns()}
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab="Đồ án của tôi" key="my">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
                gap: 16,
              }}
            >
              <Input
                placeholder="Tìm kiếm theo tên đề tài"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                value={searchMyTheses}
                onChange={(e) => setSearchMyTheses(e.target.value)}
                allowClear
              />
              <Button
                key="register"
                type="primary"
                onClick={() => {
                  setIsCreateRequestModalVisible(true);
                }}
              >
                Đề xuất đề tài
              </Button>
            </div>
            {myTheses.length === 0 && !isLoadingMy ? (
              <Empty
                description="Bạn chưa đăng ký đề tài nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Table
                dataSource={filteredMyTheses}
                rowKey="thesisId"
                loading={isLoadingMy}
                columns={getMyThesesColumns()}
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab="Yêu cầu hướng dẫn" key="request">
            <RequestTab />
          </TabPane>
        </Tabs>
      </Card>

      <ThesisDetailModal
        visible={isThesisDetailModalVisible}
        onCancel={() => setIsThesisDetailModalVisible(false)}
        thesis_id={selectedThesesId || 0}
        refetch={refetch}
      />

      <CreateRequestModal
        visible={isCreateRequestModalVisible}
        onCancel={() => setIsCreateRequestModalVisible(false)}
        refetch={refetch}
      />

      <SelectLecturerModal
        isModalOpen={isCreaCreateRequestTeacher}
        thesis_id={selectedThesesId || 0}
        setIsModalOpen={setIsCreateRequestTeacher}
      />
    </div>
  );
};

export default ThesisList;
