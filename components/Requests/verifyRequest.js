'use client'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function verifyRequest(data, setLoading, lang, setStep, link, router) {
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
    const url = `${API_BASE_URL}/auth/activate`;
    const formData = new FormData();
    formData.append('_method', 'patch');
    formData.append('userType', "club");
    formData.append('countryCode', data.country);
    formData.append('phone', data.phone);
    formData.append('activationCode', data.code);
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
            if (link === "/reset-password") {
                setStep("reset-password");
            } else {
                toast(message, {
                    style: {
                        background: "#1B8354",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                    },
                    description: `${lang === "ar" ? "مرحبا " : "Hello"} ${response.data.data.name}`
                });
                localStorage.setItem("token", response.data.data.token);
                // also set cookie so middleware can read it
                document.cookie = `token=${encodeURIComponent(response.data.data.token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
                router.push(link);
            }
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
