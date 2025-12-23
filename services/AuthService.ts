import apiRequest from "@/lib/apiRequest";

export const LOCAL_STORAGE_AUTH = "auth";

const AuthService = {
  login: async (params: { user: string; password: string }) => {
    const response = await apiRequest("POST", "/api/login", params);

    if (response?.success && response?.data) {
      localStorage.setItem(
        LOCAL_STORAGE_AUTH,
        JSON.stringify(response.data)
      );
    }

    return response;
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH);
    window.location.href = "/login";
  },

  getAuth: () => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(LOCAL_STORAGE_AUTH);
    return data ? JSON.parse(data) : null;
  },
};

export default AuthService;