// lib/api/login.js
'use client'
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function createNewRequest(type, data, setLoading, lang, setShowCongrats, router) {
    setLoading(true)
    const url = `${API_BASE_URL}/service-requests`;
    const formData = new FormData();

    // Text fields
    formData.append('type', type);

    if (type == "membership") {
        formData.append('playerId', data.id);
    }
    else {
        formData.append('licenseType', data.licenseType);
        formData.append('clubApproval', data.clubApproval[0]);
        formData.append('playerId', data.player_id);
    }


    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
    const token = Cookies.get("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.post(url, formData, { headers });
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
            setShowCongrats(true)
            setTimeout(() => {
                setShowCongrats(false)
                router.push("/orders")
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

