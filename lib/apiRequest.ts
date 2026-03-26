import axios from "axios";
import { toast } from "sonner";
import { logout } from "@/lib/auth";

const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any
) => {
  try {
    let token: string | null = null;

    if (typeof window !== "undefined") {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        const auth = JSON.parse(authRaw);
        token = auth?.access_token || null;
      }
    }

    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
      data,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    // 🔴 AUTH / JWT EXPIRED
    if (
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes("jwt")
    ) {
      toast.error("Session expired. Please login again.");

      // ✅ CLEAR AUTH STORAGE
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }

      // ⏳ small delay for toast visibility
      setTimeout(() => {
        logout(); // redirect to login
      }, 1200);

      return {
        success: false,
        message: "Session expired",
      };
    }

    // 🔔 NORMAL API ERROR
    toast.error(message);

    return {
      success: false,
      message,
    };
  }
};

export default apiRequest;