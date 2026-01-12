'use client';
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";

const fetchServiceCost = async (lang, type) => {
  const token = Cookies.get("token");

  const headers = {
    lang,
    secretKey: "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axios.get(`${API_BASE_URL}/service-requests/cost?type=${type}`, { headers });
  return response.data.data;
};

export const useGetServiceCost = (lang, type) =>
  useQuery({
    queryKey: ["serviceCost", lang, type],
    queryFn: () => fetchServiceCost(lang, type),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60,
  });
