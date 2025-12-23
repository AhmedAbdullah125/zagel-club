'use client';
import axios from "axios";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
const fetchCities = async (lang) => {
  console.log(lang);

  const token = Cookies.get("token");
  const headers = {
    'lang': lang,
    "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a"
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get(
    `${API_BASE_URL}/cities`,
    { headers }
  );
  return response.data.data;
}

export const useGetCities = (lang) => {
  const query = useQuery({
    queryKey: ["cities", lang],
    queryFn: () => fetchCities(lang),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 1,
  });

  return query;
};
