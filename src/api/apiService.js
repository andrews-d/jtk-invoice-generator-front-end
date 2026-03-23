import api from "./axios";

// ✅ GET ALL
export const getAll = async (endpoint) => {
  const res = await api.get(`/${endpoint}`);
  return res.data;
};

// ✅ GET BY ID
export const getById = async (endpoint, id) => {
  const res = await api.get(`/${endpoint}/${id}`);
  return res.data;
};

// ✅ CREATE
export const createItem = async (endpoint, data) => {
  const res = await api.post(`/${endpoint}`, data);
  return res.data;
};

// ✅ UPDATE
export const updateItem = async (endpoint, id, data) => {
  const res = await api.put(`/${endpoint}/${id}`, data);
  return res.data;
};

// ✅ DELETE
export const deleteItem = async (endpoint, id) => {
  const res = await api.delete(`/${endpoint}/${id}`);
  return res.data;
};
