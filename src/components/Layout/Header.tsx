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
import { USER_ROLES } from "@/lib/constants";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const getRoleTagColor = (role: string) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "red";
    case USER_ROLES.LECTURER:
      return "blue";
    case USER_ROLES.STUDENT:
      return "green";
    default:
      return "default";
  }
};

const Header = ({
  collapsed,
  setCollapsed,
  onProfileClick,
  onLogout,
}: HeaderProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { token } = theme.useToken();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ",
    },
    {
      type: "divider",
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
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
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
            {user?.role && (
              <Tag
                color={getRoleTagColor(user.role)}
                style={{ textTransform: "capitalize" }}
              >
                {user.role}
              </Tag>
            )}
            <Avatar icon={<UserOutlined />} />
            <span>{user?.name}</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Header;
