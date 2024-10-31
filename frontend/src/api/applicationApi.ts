import axios from "axios";

const API_URL = "http://localhost:5001/api/application";

export const submitApplication = async (content: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_URL}/submit`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${API_URL}/update`,
    { applicationId, status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
