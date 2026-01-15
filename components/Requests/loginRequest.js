// lib/api/login.js
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
export async function loginRequest(data, setLoading, lang, setStep, router) {
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
    const url = `${API_BASE_URL}/auth/signin`;
    const formData = new FormData();
    formData.append('userType', "club");
    formData.append('countryCode', data.country.split(" ")[0]);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('deviceId', getDeviceId());
    formData.append('deviceType', "web");
    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }

    try {
        const response = await axios.post(url, formData, { headers });
        const message = response?.data?.message;

        if (response.data.key === "success" || "needActive") {
            setLoading(false)
            if (response.data.key === "needActive") {
                setStep(2)
                toast(message, {
                    style: {
                        background: "#1B8354",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                    },
                });
            }
            else {
                localStorage.setItem("token", response.data.data.token);
                // also set cookie so middleware can read it
                document.cookie = `token=${encodeURIComponent(response.data.data.token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
                router.push("/");
                toast(message, {
                    style: {
                        background: "#1B8354",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                    },
                    description: `${lang === "ar" ? "مرحبا " : "Hello"} ${response.data.data.name}`
                });
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
