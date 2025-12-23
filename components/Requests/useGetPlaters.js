'use client';
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";

const fetchPlayers = async (lang, page, keyWord) => {
    const token = Cookies.get("token");

    const headers = {
        lang,
        secretKey: "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a",
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await axios.get(`${API_BASE_URL}/club/players?page=${page}&limit=20${keyWord ? `&keyword=${keyWord}` : ""}`, { headers });
    return response.data;
};

export const useGetPlayers = (lang, page, keyWord) =>
    useQuery({
        queryKey: ["players", lang, page, keyWord],
        queryFn: () => fetchPlayers(lang, page, keyWord),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60,
    });
