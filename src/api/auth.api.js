import api from "./axios";

export const loginAPI = async (data) => {
  return await api.post("/auth/login", data);
};

export const meAPI = async () => {
  return await api.get("/auth/me");
};

export const changePasswordAPI = async (data) => {
  return await api.post("/auth/change-password", data);
};

export const forgotPasswordAPI = async (data) => {
  return await api.post("/auth/forgot-password", data);
};

export const resetPasswordAPI = async (data) => {
  return await api.post("/auth/reset-password", data);
};

export const updateProfileAPI = async (data) => {
  return await api.put("/auth/me", data);
};
