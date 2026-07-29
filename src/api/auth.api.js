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
