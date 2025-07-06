import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000"
})

export const denyStudentAccount = async (studentId: string, token: string) => {
  const response = await api.post(
    `/students/${studentId}/deny`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const approveStudentAccount = async (studentId: string, token: string) => {
  const response = await api.post(
    `/students/${studentId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};