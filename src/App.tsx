import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { App as AntdApp } from "antd";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ThesisListPage from "@/pages/Student/ThesisList/ThesisListPage";
import RequestDetailPage from "@/pages/Student/RequestDetail/RequestDetail";
import ThesisManagement from "@/pages/Teacher/ThesisManagement/ThesisManagement";
import CreateThesis from "@/pages/Teacher/CreateThesis";
import UserManagement from "@/pages/Admin/UserManagement";
import ApproveRequests from "@/pages/Admin/ApproveRequests";
import TeacherRequestDetailPage from "@/pages/Teacher/RequestManagement/RequestDetailPage";
import TeacherList from "@/pages/Student/TeacherList";
import { USER_ROLES } from "./lib/constants";
import HomePage from "./pages/Home";
import AdminThesisManagement from "./pages/Admin/AdminThesisManagement";
import RequestListPage from "./pages/Teacher/RequestManagement/RequestListPage";

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <AntdApp>
      <BrowserRouter>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              {/* Routes cho Sinh viên */}
              {user.role_name === USER_ROLES.STUDENT && (
                <>
                  <Route path="thesis-list" element={<ThesisListPage />} />
                  <Route path="teacher-list" element={<TeacherList />} />
                  <Route
                    path="request-detail/:id"
                    element={<RequestDetailPage />}
                  />
                </>
              )}

              {/* Routes cho Giảng viên */}
              {(user.role_name === USER_ROLES.INSIDE_LECTURER ||
                user.role_name === USER_ROLES.OUTSIDE_LECTURER) && (
                <>
                  <Route
                    path="thesis-management"
                    element={<ThesisManagement />}
                  />
                  <Route path="create-thesis" element={<CreateThesis />} />
                  <Route
                    path="request-detail/:id"
                    element={<TeacherRequestDetailPage />}
                  />
                  <Route path="request-list" element={<RequestListPage />} />

                  {/* <Route
                    path="student-thesis-detail/:studentId"
                    element={<TeacherThesisDetail />}
                  /> */}
                </>
              )}

              {/* Routes cho Admin */}
              {user.role_name === USER_ROLES.ADMIN && (
                <>
                  <Route path="user-management" element={<UserManagement />} />
                  <Route
                    path="approve-requests"
                    element={<ApproveRequests />}
                  />
                  <Route
                    path="thesis-list"
                    element={<AdminThesisManagement />}
                  />
                </>
              )}

              {/* Redirect về trang chủ nếu không tìm thấy route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </AntdApp>
  );
};

export default App;
