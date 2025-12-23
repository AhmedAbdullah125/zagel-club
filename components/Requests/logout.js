// lib/api/login.js
'use client'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function logout(setLoading, lang, router) {
    setLoading(true)
    const generateDeviceId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let deviceId = '';
        for (let i = 0; i < 20; i++) {
            deviceId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return deviceId;
    };
    const getDeviceId = () => {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = generateDeviceId();
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    };
    const url = `${API_BASE_URL}/auth/logout`;
    const formData = new FormData();
    formData.append('deviceId', getDeviceId());
    formData.append('deviceType', "web");
    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
    const token = Cookies.get("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.patch(url, formData, { headers });
        const message = response?.data?.message;

        if (response.data.key === "success") {
            setLoading(false)
            toast(message, {
                style: {
                    background: "#1B8354",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
            localStorage.removeItem("token");
            Cookies.remove("token");
            router.push("/login");

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
