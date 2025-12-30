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
  return Boolean(auth?.role =="super admin");
};

export const isExecutive = (): boolean => {
  const auth = getAuth();
  return Boolean(auth?.role =="executive");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/login";
};