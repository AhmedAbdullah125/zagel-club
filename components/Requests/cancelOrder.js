'use client'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function cancelOrder(id, reasonId, onSuccess, lang, onClose) {

    const url = `${API_BASE_URL}/service-requests/cancel`;
    const formData = new FormData();
    formData.append('id', id);
    formData.append('reason', reasonId);

    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
    const token = Cookies.get("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.post(url, formData, { headers });
        const message = response?.data?.message;
        onClose();
        if (response.data.key === "success") {
            onSuccess(message);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            toast(message, {
                style: {
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
        }
    } catch (error) {
        onClose();
        const errorMessage = error?.response?.data?.message || error.message;
        toast(errorMessage, {
            style: {
                background: "#dc3545",
                color: "#fff",
                borderRadius: "10px",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
            },
        });
    }
}
