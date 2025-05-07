import React from "react";
import { Card, Timeline, Pagination } from "antd";
import { styles, props } from "./styles";

interface Activity {
  key: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

interface ActivityHistoryProps {
  activities: Activity[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  activities,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  // Function to get paged data
  const paged = <T,>(data: T[], page: number, size: number) =>
    data.slice((page - 1) * size, page * size);

  return (
    <Card title="Lịch sử hoạt động" style={styles.cardSpacing}>
      <Timeline>
        {paged(activities, currentPage, pageSize).map((activity) => (
          <Timeline.Item key={activity.key}>
            <div>
              <span>{activity.time}</span>
              <span style={{ fontWeight: "bold", margin: "0 8px" }}>
                {activity.user}
              </span>
              <span>{activity.action}</span>
            </div>
            <div style={{ marginTop: 4, color: "#666" }}>
              {activity.details}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
      {activities.length > pageSize && (
        <div style={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            total={activities.length}
            pageSize={pageSize}
            onChange={onPageChange}
            size={props.pagination.size}
          />
        </div>
      )}
    </Card>
  );
};

export default ActivityHistory;
