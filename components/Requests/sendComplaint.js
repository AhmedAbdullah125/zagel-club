'use client'
import React from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
export async function sendComplaint(data, setLoading, hasRequest, lang, onSuccess) {
    setLoading(true)

    const url = `${API_BASE_URL}/complaint`;
    const formData = new FormData();
    formData.append('reason', data.reason);
    formData.append('details', data.details);
    formData.append('image', data.image);
    if (hasRequest) {
        formData.append('hasRequest', true);
        formData.append('requestId', data.requestId);
    }

    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
    const token = Cookies.get("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.post(url, formData, { headers });
        const message = response?.data?.message;
        if (response.data.key === "success" || "needActive") {
            toast(message, {
                style: {
                    background: "#1B8354",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
            setLoading(false)
            onSuccess();
        } else {
            toast(message, {
                style: {
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
            setLoading(false)
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
