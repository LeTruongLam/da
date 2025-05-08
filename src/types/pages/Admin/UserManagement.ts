import type { UserRole } from "../../../store/slices/authSlice";

export interface UserForm {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
