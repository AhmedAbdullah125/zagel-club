// lib/api/login.js
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
export async function resetPassword(data, setLoading, lang, router, setShowSuccessModal) {
    setLoading(true)
    const url = `${API_BASE_URL}/auth/reset-password`;
    const formData = new FormData();
    formData.append('userType', "club");
    formData.append('countryCode', data.country);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.repassword);
    formData.append('deviceType', "web");
    const headers = { 'lang': lang, "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a" }
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
            setShowSuccessModal(true)
            setTimeout(() => {
                router.push("/login")
                setShowSuccessModal(false)
            }, 2000)

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
