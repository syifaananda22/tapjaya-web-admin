
import { apiRequest } from "@/lib/api";
import type {
  Product,
  ProductInput,
} from "@/types/product";

export const productService = {
  getAll(
    search = "",
    category = "",
    status = ""
  ) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (category) {
      params.set("category", category);
    }

    if (status) {
      params.set("status", status);
    }

    const query = params.toString();

    return apiRequest<{ data: Product[] }>(
      `/api/products${query ? `?${query}` : ""}`
    );
  },

  getById(id: number) {
    return apiRequest<{ data: Product }>(
      `/api/products/${id}`
    );
  },

  create(data: ProductInput) {
    return apiRequest<{
      data: Product;
      message: string;
    }>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(
    id: number,
    data: ProductInput
  ) {
    return apiRequest<{
      data: Product;
      message: string;
    }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  changeStatus(
    id: number,
    is_active: boolean
  ) {
    return apiRequest<{ message: string }>(
      `/api/products/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          is_active,
        }),
      }
    );
  },

  delete(id: number) {
    return apiRequest<{ message: string }>(
      `/api/products/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  uploadImage(file: File) {
    const formData = new FormData();

    formData.append("image", file);

    return apiRequest<{
      message: string;
      image: string;
    }>("/api/upload/products", {
      method: "POST",
      body: formData,
    });
  },
};
