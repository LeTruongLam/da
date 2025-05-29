import { USER_ROLES } from "@/lib/constants";
import type { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role_name === USER_ROLES.STUDENT) {
        navigate("/thesis-list");
      } else if (
        user.role_name === USER_ROLES.INSIDE_LECTURER ||
        user.role_name === USER_ROLES.OUTSIDE_LECTURER
      ) {
        navigate("/thesis-management");
      } else if (user.role_name === USER_ROLES.ADMIN) {
        navigate("/thesis-list");
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
