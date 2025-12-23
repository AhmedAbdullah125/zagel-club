// lib/api/login.js
import axios from 'axios';
import { API_BASE_URL } from '@/lib/apiConfig';
import { toast } from 'sonner';
export async function register(data, setLoading, lang, setStep, router, setShowSuccessModal) {
    setLoading(true)
    const url = `${API_BASE_URL}/auth/club/signup`;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('city', data.city);
    formData.append('area', data.administrativeRegion);
    formData.append('address', data.nationalAddress);
    formData.append('logo', data.clubLogo[0]);
    formData.append('licenseNumber', data.licenseNumber);
    formData.append('email', data.email);
    formData.append('countryCode', data.country);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('passwordConfirm', data.repassword);
    const headers = {
        'lang': lang,
        "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a"
    }
    try {
        const response = await axios.post(url, formData, { headers });
        const message = response?.data?.message;
        console.log(response);

        if (response.data.key === "success") {

            setLoading(false)
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                router.push("/login")
            }, 3000);
        } else {
            toast(message, {
                style: {
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
                description: 'استجابة غير متوقعة',
            });
            setStep(1)
            setTimeout(() => {
                setLoading(false);
            }, 1000);
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
        setStep(1)
    }
}
