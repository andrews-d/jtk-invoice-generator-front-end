import api from "./axios";

// 🔑 LOGIN
export const loginApi = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data; // ✅ always return only data
};
