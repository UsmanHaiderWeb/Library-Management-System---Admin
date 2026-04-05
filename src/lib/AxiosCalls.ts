import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000"
})

export const approveStudentAccount = async (studentId: string, token: string) => {
    const response = await api.post(
        `/api/admin/verify-account/${studentId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const denyStudentAccount = async (studentId: string, token: string) => {
    const response = await api.post(
        `/api/admin/deny-account/${studentId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
