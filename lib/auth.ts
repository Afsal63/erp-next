import axios from "axios";
const AUTH_KEY = "auth";

export const getAuth = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) : null;
};

export const getUser = () => {
  const auth = getAuth();
  return auth
    ? {
        id: auth.id,
        name: auth.name,
        surname: auth.surname,
        email: auth.email,
        role: auth.role,
        photo: auth.photo,
      }
    : null;
};

export const isSuperAdmin = (): boolean => {
  const auth = getAuth();
  return Boolean(auth?.role == "super admin");
};

export const isExecutive = (): boolean => {
  const auth = getAuth();
  return Boolean(auth?.role == "executive");
};

export const logout = async () => {
  if (typeof window === "undefined") return;
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Logout failed on backend:", error);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "/login";
  }
};
