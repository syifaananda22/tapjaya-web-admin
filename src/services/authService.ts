
import { apiRequest } from "@/lib/api";
import type { LoginResponse } from "@/types/auth";

export function loginAdmin(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: identifier,
      password,
    }),
  });
}
