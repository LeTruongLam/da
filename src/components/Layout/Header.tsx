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
import { USER_ROLE_LABELS, USER_ROLES } from "@/lib/constants";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const Header = ({
  collapsed,
  setCollapsed,
  onProfileClick,
  onLogout,
}: HeaderProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { token: themeToken } = theme.useToken();

  const userMenuItems: MenuProps["items"] = [
    ...(user?.role_name !== USER_ROLES.ADMIN
      ? [
          {
            key: "profile",
            label: "Hồ sơ",
          },
        ]
      : []),
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
        left: collapsed ? 80 : 250,
        right: 0,
        top: 0,
        zIndex: 101,
        width: `calc(100% - ${collapsed ? 80 : 250}px)`,
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
        <Tag color="blue">
          <span>
            {USER_ROLE_LABELS[user?.role_name as keyof typeof USER_ROLES]}
          </span>
        </Tag>
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <span>{user?.name}</span>
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Header;
