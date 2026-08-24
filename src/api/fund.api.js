import api from "./axios";

export const createFundAPI = async (data) => {
  return await api.post("/admin/funds", data);
};

export const getFundSummaryAPI = async () => {
  const res = await api.get("/admin/funds/summary");
  if (res.data?.data && Array.isArray(res.data.data)) {
    res.data.data = res.data.data.map((f) => ({ ...f, _id: f.id }));
  }
  return res;
};

export const useFundAPI = async (data) => {
  return await api.post("/admin/funds/use", data);
};

export const getFundHistoryAPI = async () => {
  const res = await api.get("/admin/funds/history");
  if (res.data?.data && Array.isArray(res.data.data)) {
    res.data.data = res.data.data.map((h) => ({ ...h, _id: h.id }));
  }
  return res;
};

export const createFundRequestAPI = async (data) => {
  return await api.post("/admin/fund-requests", data);
};

export const getFundRequestsAPI = async () => {
  const res = await api.get("/admin/fund-requests");
  if (res.data?.data && Array.isArray(res.data.data)) {
    res.data.data = res.data.data.map((r) => ({ ...r, _id: r.id }));
  }
  return res;
};

export const updateFundRequestStatusAPI = async (id, status) => {
  return await api.patch(`/admin/fund-requests/${id}`, { status });
};
