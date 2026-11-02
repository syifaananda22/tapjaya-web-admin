
import { apiRequest } from "@/lib/api";

import type {
  AdminProfile,
  StoreSettings,
  PasswordInput,
} from "@/types/settings";

export const settingsService = {
  getProfile() {
    return apiRequest<{ data: AdminProfile }>(
      "/api/settings/profile"
    );
  },

  updateProfile(data: {
    username: string;
    email: string;
  }) {
    return apiRequest<{
      message: string;
      data?: AdminProfile;
    }>(
      "/api/settings/profile",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  changePassword(data: PasswordInput) {
    return apiRequest<{ message: string }>(
      "/api/settings/password",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  getStore() {
    return apiRequest<{ data: StoreSettings }>(
      "/api/settings/store"
    );
  },

  updateStore(data: StoreSettings) {
    return apiRequest<{
      message: string;
      data?: StoreSettings;
    }>(
      "/api/settings/store",
      {
        method: "PUT",
        body: JSON.stringify({
          storeName: data.store_name,
          address: data.address,
          phone: data.phone,
          logo: data.logo,
        }),
      }
    );
  },
};
