import { Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  CalendarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { USER_ROLES } from "@/lib/constants";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = [
    ...(user?.role_name !== USER_ROLES.ADMIN
      ? [
          {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
        ]
      : []),
    ...(user?.role_name === USER_ROLES.STUDENT
      ? [
          {
            key: "/thesis-list",
            icon: <FileTextOutlined />,
            label: "Danh sách đồ án",
          },
          {
            key: "/teacher-list",
            icon: <TeamOutlined />,
            label: "Danh sách giảng viên",
          },
        ]
      : []),
    ...(user?.role_name === USER_ROLES.INSIDE_LECTURER ||
    user?.role_name === USER_ROLES.OUTSIDE_LECTURER
      ? [
          {
            key: "/thesis-management",
            icon: <FileTextOutlined />,
            label: "Quản lý đồ án",
          },
          {
            key: "/approve-requests",
            icon: <TeamOutlined />,
            label: "Duyệt đăng ký",
          },
        ]
      : []),
    ...(user?.role_name === USER_ROLES.ADMIN
      ? [
          {
            key: "/user-management",
            icon: <TeamOutlined />,
            label: "Quản lý người dùng",
          },
          {
            key: "/system-notifications",
            icon: <BellOutlined />,
            label: "Thông báo hệ thống",
          },
          {
            key: "/system-settings",
            icon: <SettingOutlined />,
            label: "Cài đặt hệ thống",
          },
        ]
      : []),
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <h2 style={{ margin: 0, color: token.colorPrimary }}>
          {!collapsed && "Thesis Management"}
        </h2>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["/"]}
        selectedKeys={[
          location.pathname.includes("create-thesis") ||
          (location.pathname.includes("thesis-detail") &&
            (user?.role_name === USER_ROLES.INSIDE_LECTURER ||
              user?.role_name === USER_ROLES.OUTSIDE_LECTURER))
            ? "/thesis-management"
            : location.pathname.includes("my-thesis") &&
              user?.role_name === USER_ROLES.STUDENT
            ? "/thesis-list"
            : location.pathname,
        ]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
