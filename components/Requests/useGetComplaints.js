'use client';
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";

const fetchComplaints = async (lang, page, status) => {
    const token = Cookies.get("token");
    const headers = {
        lang,
        secretKey: "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(`${API_BASE_URL}/complaints?page=${page}&limit=20${status ? `&status=${status}` : ""}`, { headers });
    return response.data;
};

export const useGetComplaints = (lang, page, status) =>
    useQuery({
        queryKey: ["complaints", lang, page, status],
        queryFn: () => fetchComplaints(lang, page, status),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60,
    });
