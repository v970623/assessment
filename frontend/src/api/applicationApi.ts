import axios, { AxiosResponse } from "axios";
import { Application } from "../components/ApplicationList";

const API_URL = "http://localhost:5001/api/application";

export const submitApplication = async (title: string, content: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API_URL}/submit`,
    { title, content },
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
