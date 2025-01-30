import axios from "axios";

const apiUrl = "http://localhost:8080/api/v1/products";

export const getProducts = async () => {
  return axios.get(apiUrl);
};

export const addProduct = async (product) => {
  return axios.post(apiUrl, product);
};

export const updateProduct = async (product) => {
  return axios.put(`${apiUrl}/${product.sku}`, product);
};

export const deleteProduct = async (id) => {
  return axios.delete(`${apiUrl}/${id}`);
};
