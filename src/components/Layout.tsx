import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Layout as AntLayout, theme, message } from "antd";
import { useState } from "react";
import { logout } from "@/services/api/auth";
import { logout as logoutAction } from "@/store/slices/authSlice";
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";
import ProfileModal from "./Layout/ProfileModal";

const { Content } = AntLayout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    } catch {
      message.error("Đăng xuất thất bại, vui lòng thử lại");
    }
  };

  return (
    <AntLayout>
      <Sidebar collapsed={collapsed} />
      <AntLayout
        style={{ marginLeft: collapsed ? 80 : 200, minHeight: "100vh" }}
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onProfileClick={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
        />
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
      </AntLayout>
      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </AntLayout>
  );
};

export default MainLayout;
