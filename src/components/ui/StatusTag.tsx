import { Tag } from "antd";
import type { ReactNode } from "react";
import {
  THESIS_STATUS_LABELS,
  THESIS_STATUS_COLORS,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
} from "@/lib/constants";

type StatusType = "thesis" | "task" | "user";

interface StatusTagProps {
  type: StatusType;
  status: string;
  email?: string;
  faculty?: string;
  customConfig?: {
    color?: string;
    text?: ReactNode;
  };
}

const StatusTag: React.FC<StatusTagProps> = ({
  type,
  status,
  customConfig,
}) => {
  if (customConfig) {
    return <Tag color={customConfig.color}>{customConfig.text}</Tag>;
  }

  // Nếu không có status, trả về tag mặc định
  if (!status) {
    return <Tag>Không xác định</Tag>;
  }

  let color = "default";
  let text: ReactNode = status;

  switch (type) {
    case "thesis":
      color =
        THESIS_STATUS_COLORS[status as keyof typeof THESIS_STATUS_COLORS] ||
        "default";
      text =
        THESIS_STATUS_LABELS[status as keyof typeof THESIS_STATUS_LABELS] ||
        status;
      break;

    case "task":
      color =
        TASK_STATUS_COLORS[status as keyof typeof TASK_STATUS_COLORS] ||
        "default";
      text =
        TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] || status;
      break;

    case "user":
      color =
        USER_ROLE_COLORS[status as keyof typeof USER_ROLE_COLORS] || "default";
      text =
        USER_ROLE_LABELS[status as keyof typeof USER_ROLE_LABELS] || status;
      break;
  }

  return <Tag color={color}>{text}</Tag>;
};

export default StatusTag;
