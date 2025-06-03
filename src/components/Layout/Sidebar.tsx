import { Layout, Menu, theme } from "antd";
import {
  CheckCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GroupOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { USER_ROLES } from "@/lib/constants";
import LogoUTT from "./../../assets/Logo-DH-Cong-Nghe-Giao-Thong-Van-Tai..png";

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
    ...(user?.role_name === USER_ROLES.STUDENT
      ? [
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Trang chủ",
          },
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
          {
            key: "/committee-management",
            icon: <GroupOutlined />,
            label: "Quản lý hội đồng",
          },
        ]
      : []),
    ...(user?.role_name === USER_ROLES.INSIDE_LECTURER ||
    user?.role_name === USER_ROLES.OUTSIDE_LECTURER
      ? [
         {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Trang chủ",
          },
          {
            key: "/thesis-management",
            icon: <FileTextOutlined />,
            label: "Quản lý đồ án",
          },
          {
            key: "/request-list",
            icon: <TeamOutlined />,
            label: "Danh sách đăng ký",
          },
          {
            key: "/committee-management",
            icon: <GroupOutlined />,
            label: "Quản lý hội đồng",
          },
        ]
      : []),
    ...(user?.role_name === USER_ROLES.ADMIN
      ? [
         {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Trang chủ",
          },
          {
            key: "/user-management",
            icon: <TeamOutlined />,
            label: "Quản lý người dùng",
          },
          {
            key: "/thesis-list",
            icon: <FileTextOutlined />,
            label: "Danh sách đồ án",
          },
          {
            key: "/approve-requests",
            icon: <CheckCircleOutlined />,
            label: "Duyệt đăng ký",
          },
          {
            key: "/committee-management",
            icon: <GroupOutlined />,
            label: "Quản lý hội đồng",
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
      width={256}
    >
      <div
        style={{
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {!collapsed && <img src={LogoUTT} height={64} />}
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
            : (location.pathname.includes("my-thesis") &&
                user?.role_name === USER_ROLES.STUDENT) ||
              (location.pathname.includes("request-detail") &&
                user?.role_name === USER_ROLES.STUDENT)
            ? "/thesis-list"
            : location.pathname.includes("request-detail") &&
              (user?.role_name === USER_ROLES.INSIDE_LECTURER ||
                user?.role_name === USER_ROLES.OUTSIDE_LECTURER)
            ? "/request-list"
            : location.pathname.includes("committee")
            ? "/committee-management"
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
