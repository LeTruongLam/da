import { Card, Table, Button, Space, Pagination, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export interface Meeting {
  id: string;
  title: string;
  time: string;
  student: string;
  link: string;
}

interface MeetingsTableProps {
  meetings: Meeting[];
  currentPage: number;
  pageSize: number;
  onAddMeeting: () => void;
  onDeleteMeeting: (meeting: Meeting) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const MeetingsTable: React.FC<MeetingsTableProps> = ({
  meetings,
  currentPage,
  pageSize,
  onAddMeeting,
  onDeleteMeeting,
  onPageChange,
  loading = false,
}) => {
  const paginatedMeetings = meetings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title="Lịch họp"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddMeeting}>
          Đặt lịch mới
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Table
          columns={[
            { title: "Tiêu đề", dataIndex: "title", key: "title" },
            { title: "Thời gian", dataIndex: "time", key: "time" },
            {
              title: "Sinh viên",
              dataIndex: "student",
              key: "student",
            },
            {
              title: "Thao tác",
              key: "action",
              render: (_, record) => (
                <Space>
                  <Button type="link" href={record.link} target="_blank">
                    Tham gia
                  </Button>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDeleteMeeting(record)}
                  >
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={paginatedMeetings}
          pagination={false}
          size="small"
          loading={loading}
        />
        {meetings.length > pageSize && (
          <Pagination
            current={currentPage}
            total={meetings.length}
            pageSize={pageSize}
            onChange={onPageChange}
            size="small"
            style={{ marginTop: 16, textAlign: "right" }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default MeetingsTable;
