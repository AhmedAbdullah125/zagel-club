// lib/api/login.js
'use client'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function contactUs(data, setLoading, lang, form, setShowCongrats) {
    setLoading(true)
    const url = `${API_BASE_URL}/contact`;
    const formData = new FormData();
    formData.append('deviceType', "web");
    formData.append('name', data.name);
    formData.append('countryCode', data.country);
    formData.append('phone', data.phone);
    formData.append('message', data.message);
    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
    const token = Cookies.get("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.post(url, formData, { headers });
        const message = response?.data?.message;

        if (response.data.key === "success") {
            form.reset();
            setLoading(false)
            toast(message, {
                style: {
                    background: "#1B8354",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
            setShowCongrats(true)
            setTimeout(() => {
                setShowCongrats(false)
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
        setLoading(false);
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
