import React from "react";
import { Card, Button, Table, Space, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { styles, props } from "./styles";

interface Meeting {
  key: string;
  title: string;
  time: string;
  student: string;
  link: string;
}

interface MeetingSectionProps {
  meetings: Meeting[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onAddMeeting: () => void;
  onDeleteMeeting: (meeting: Meeting) => void;
}

const MeetingSection: React.FC<MeetingSectionProps> = ({
  meetings,
  page,
  pageSize,
  onPageChange,
  onAddMeeting,
  onDeleteMeeting,
}) => {
  // Function to get paged data
  const paged = <T,>(data: T[], currentPage: number, size: number) =>
    data.slice((currentPage - 1) * size, currentPage * size);

  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    { title: "Sinh viên", dataIndex: "student", key: "student" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Meeting) => (
        <Space>
          <Button
            type="link"
            href={record.link}
            target="_blank"
            size={props.button.size}
          >
            Tham gia
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteMeeting(record)}
            size={props.button.size}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Lịch họp"
      style={styles.cardSpacing}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddMeeting}
          size={props.button.size}
        >
          Đặt lịch mới
        </Button>
      }
    >
      <div style={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={paged(meetings, page, pageSize)}
          pagination={false}
          size={props.table.size}
        />
      </div>
      {meetings.length > pageSize && (
        <div style={styles.paginationContainer}>
          <Pagination
            current={page}
            total={meetings.length}
            pageSize={pageSize}
            onChange={onPageChange}
            size={props.pagination.size}
          />
        </div>
      )}
    </Card>
  );
};

export default MeetingSection;
