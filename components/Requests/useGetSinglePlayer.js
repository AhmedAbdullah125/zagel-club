'use client';
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";

const fetchSinglePlayer = async (lang, id) => {
  const token = Cookies.get("token");

  const headers = {
    lang,
    secretKey: "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axios.get(`${API_BASE_URL}/club/players/details?id=${id}`, { headers });
  return response.data.data;
};

export const useGetSinglePlayer = (lang, id) =>
  useQuery({
    queryKey: ["singlePlayer", lang, id],
    queryFn: () => fetchSinglePlayer(lang, id),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,
  });
