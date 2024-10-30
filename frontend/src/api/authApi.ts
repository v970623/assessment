import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const registerUser = async (username: string, password: string) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
