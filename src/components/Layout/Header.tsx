import {
  Avatar,
  Button,
  Dropdown,
  Space,
  Tag,
  theme,
  type MenuProps,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/api/profile";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const getRoleTagColor = (role?: string) => {
  if (!role) return "default";
  return USER_ROLE_COLORS[role as keyof typeof USER_ROLE_COLORS] || "default";
};

const getRoleLabel = (role?: string) => {
  if (!role) return "";
  return USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] || role;
};

const Header = ({
  collapsed,
  setCollapsed,
  onProfileClick,
  onLogout,
}: HeaderProps) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { token: themeToken } = theme.useToken();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.userId],
    queryFn: async () => {
      if (!user) {
        return null;
      }
      try {
        const response = await getUserProfile(user.userId);
        return response;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    enabled: !!token && !!user,
  });

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ",
    },
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      onLogout();
    } else if (key === "profile") {
      onProfileClick();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: collapsed ? 80 : 200,
        right: 0,
        top: 0,
        zIndex: 101,
        width: `calc(100% - ${collapsed ? 80 : 200}px)`,
        padding: "0 16px",
        background: themeToken.colorBgContainer,
        borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </Space>
      <Space>
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: "pointer" }}>
            {(userProfile?.role || user?.role) && (
              <Tag
                color={getRoleTagColor(userProfile?.role || user?.role)}
                style={{ textTransform: "capitalize" }}
              >
                {getRoleLabel(userProfile?.role || user?.role)}
              </Tag>
            )}
            <Avatar icon={<UserOutlined />} />
            <span>{userProfile?.name || user?.name}</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Header;
