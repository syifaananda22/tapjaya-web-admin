
export interface AdminProfile {
  id: number;
  username: string;
  email: string;
}

export interface StoreSettings {
  store_name: string;
  address: string | null;
  phone: string | null;
  logo: string | null;
}

export interface PasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
