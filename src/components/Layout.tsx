import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  theme,
  Space,
  type MenuProps,
} from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const menuItems = [
    ...(user?.role !== "admin"
      ? [
          {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
        ]
      : []),
    ...(user?.role === "student"
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
    ...(user?.role === "teacher"
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
          {
            key: "/meeting-approval",
            icon: <CalendarOutlined />,
            label: "Quản lý lịch hẹn",
          },
        ]
      : []),
    ...(user?.role === "admin"
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

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Hồ sơ",
    },
    {
      key: "settings",
      label: "Cài đặt",
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
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <Layout>
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
              user?.role === "teacher")
              ? "/thesis-management"
              : location.pathname.includes("my-thesis") &&
                user?.role === "student"
              ? "/thesis-list"
              : location.pathname,
          ]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: "100vh" }}>
        <Header
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
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: `88px 16px 24px 16px`,
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 280,
            overflow: "auto",
            height: "calc(100vh - 112px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
