/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Table, Button, Space, message, Modal, Tabs } from "antd";
import { useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  updateRequestStatus,
  type AllRequestResponse,
} from "@/services/api/request";
import {
  REQUEST_STATUS,
  THESIS_STATUS,
  THESIS_STATUS_LABELS,
  USER_ROLE_LABELS,
} from "@/lib/constants";
import {
  getAllTheses,
  updateThesisStatus,
  type ThesisResponse,
} from "@/services/api";
import dayjs from "dayjs";

const CommitteeManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [modal, contextHolder] = Modal.useModal();

  const {
    data: allTheses,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["theses", "all"],
    queryFn: () => getAllTheses(),
  });

  const {
    data: onHoldTheses,
    isLoading: isLoadingOnHold,
    refetch: refetchOnHold,
  } = useQuery({
    queryKey: ["theses", "on-hold"],
    queryFn: () => getAllTheses({ status: THESIS_STATUS.ON_HOLD }),
  });

  const handleUpdateStatus = async (
    thesisId: number,
    status: string,
    actionLabel: string
  ) => {
    modal.confirm({
      title: `${actionLabel} đề tài`,
      content: `Bạn có chắc chắn muốn ${actionLabel.toLowerCase()} đề tài này?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      async onOk() {
        try {
          await updateThesisStatus(thesisId, status);
          message.success(`${actionLabel} thành công`);
          refetchAll();
          refetchOnHold();
        } catch (err) {
          message.error(`${actionLabel} thất bại`);
        }
      },
    });
  };

  const renderColumns = (withActions = false) => [
    {
      title: "Tên đề tài",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người tạo",
      dataIndex: "creator_name",
      key: "creator_name",
    },
    {
      title: "Vai trò",
      dataIndex: "role_name",
      key: "role_name",
      render: (value: string) => (
        <Space>
          {USER_ROLE_LABELS[value as keyof typeof USER_ROLE_LABELS] || "--"}
        </Space>
      ),
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
      render: (status: string) => {
        const label =
          THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS];
        return label || "Không xác định";
      },
    },
    ...(withActions
      ? [
          {
            title: "Thao tác",
            key: "action",
            render: (_, record: ThesisResponse) => (
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() =>
                    handleUpdateStatus(
                      record.thesis_id,
                      THESIS_STATUS.AVAILABLE,
                      "Duyệt"
                    )
                  }
                >
                  Duyệt
                </Button>
                <Button
                  type="link"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() =>
                    handleUpdateStatus(
                      record.thesis_id,
                      THESIS_STATUS.ADMIN_REJECT,
                      "Từ chối"
                    )
                  }
                >
                  Từ chối
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card title="Quản lý hội đồng bảo vệ">
      {contextHolder}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "all",
            label: "Tất cả đề tài",
            children: (
              <Table
                columns={renderColumns()}
                dataSource={allTheses || []}
                rowKey="id"
                loading={isLoadingAll}
                pagination={{ pageSize: 5 }}
              />
            ),
          },
          {
            key: "on-hold",
            label: "Chờ duyệt",
            children: (
              <Table
                columns={renderColumns(true)}
                dataSource={onHoldTheses || []}
                rowKey="id"
                loading={isLoadingOnHold}
                pagination={{ pageSize: 5 }}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};

export default CommitteeManagement;
