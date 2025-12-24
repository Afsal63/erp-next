import apiRequest from "@/lib/apiRequest";

export const LOCAL_STORAGE_AUTH = "auth";

const AuthService = {
  login: async (params: { user: string; password: string }) => {
    const response = await apiRequest("POST", "/api/login", params);

    if (response?.success && response?.result) {
      const authData = {
        id: response.result.id,
        name: response.result.name,
        surname: response.result.surname,
        email: response.result.email,
        role: response.result.role,
        photo: response.result.photo,
        access_token: response.result.access_token,
        isLoggedIn: true,
      };

      localStorage.setItem(
        LOCAL_STORAGE_AUTH,
        JSON.stringify(authData)
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
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH);
    return raw ? JSON.parse(raw) : null;
  },
};

export default AuthService;