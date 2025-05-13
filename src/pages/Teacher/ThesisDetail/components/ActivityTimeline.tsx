import { Card, Timeline, Pagination, Spin } from "antd";

export interface Activity {
  key: string;
  time: string;
  action: string;
  user: string;
  details: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  currentPage,
  pageSize,
  onPageChange,
  loading = false,
}) => {
  const paginatedActivities = activities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card>
      <Spin spinning={loading}>
        <Timeline
          items={paginatedActivities.map((activity) => ({
            color: activity.user === "Giảng viên" ? "blue" : "green",
            children: (
              <>
                <p>
                  <strong>{activity.action}</strong> bởi {activity.user} -{" "}
                  {activity.time}
                </p>
                <p>{activity.details}</p>
              </>
            ),
          }))}
        />
        {activities.length > pageSize && (
          <Pagination
            current={currentPage}
            total={activities.length}
            pageSize={pageSize}
            onChange={onPageChange}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default ActivityTimeline;
