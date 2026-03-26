import axios from "axios";
import { toast } from "sonner";
import { logout } from "@/lib/auth";

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeTokenRefresh = (cb: (success: boolean) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
};

const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: any
): Promise<any> => {
  try {
    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
      data,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const isJwtExpired = error?.response?.data?.jwtExpired;
    const message = error?.response?.data?.message || error?.message || "Something went wrong";

    // 🔴 AUTH / JWT EXPIRED
    if (status === 401 && isJwtExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/refresh-token`,
            {},
            { withCredentials: true }
          );

          if (refreshRes.data.success) {
            isRefreshing = false;
            onRefreshed(true);
            // Retry the original request
            return apiRequest(method, url, data);
          } else {
            throw new Error('Refresh failed');
          }
        } catch (refreshErr) {
          isRefreshing = false;
          onRefreshed(false);
          toast.error("Session expired. Please login again.");
          setTimeout(() => logout(), 1200);
          return { success: false, message: "Session expired" };
        }
      } else {
        // Wait for the ongoing refresh request
        return new Promise((resolve) => {
          subscribeTokenRefresh((success) => {
            if (success) {
              resolve(apiRequest(method, url, data));
            } else {
              resolve({ success: false, message: "Session expired" });
            }
          });
        });
      }
    }

    // Unhandled 401s or 403s
    if (status === 401 || status === 403) {
      toast.error("Session expired or Unauthorized. Please login again.");
      setTimeout(() => logout(), 1200);
      return { success: false, message: "Unauthorized" };
    }

    // 🔔 NORMAL API ERROR
    toast.error(message);
    return { success: false, message };
  }
};

export default apiRequest;