import axios, { AxiosResponse } from "axios";

interface Application {
  _id: string;
  content: string;
  status: string;
  userId: {
    username: string;
    email: string;
  };
  createdAt: string;
}

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

export const getApplications = async (): Promise<
  AxiosResponse<Application[]>
> => {
  const token = localStorage.getItem("token");
  return axios.get<Application[]>(`${API_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
