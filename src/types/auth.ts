
export interface AdminInfo {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  tokenType: string;
  expiresIn: number;
  admin: AdminInfo;
}
