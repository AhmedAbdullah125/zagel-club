'use client';
import axios from "axios";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { t } from "@/lib/i18n";
import Cookies from "js-cookie";
const fetchRegions = async (lang, cityId, toast) => {
  if (!cityId) return [];
  const token = Cookies.get("token");
  const headers = {
    'lang': lang,
    "secretKey": "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a"
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get(
    `${API_BASE_URL}/regions?cityId=${cityId}`,
    { headers }
  );
  if (response.data.data.length == 0) {
    toast(t(lang, "no_regions_found"), {
      style: {
        background: "#dc3545",
        color: "#fff",
        borderRadius: "10px",
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
      },
    });
  }
  return response.data.data;

}

export const useGetRegions = (lang, cityId, toast) => {
  const query = useQuery({
    queryKey: ["regions", lang, cityId],
    enabled: !!cityId, // only fetch if cityId is provided
    queryFn: () => fetchRegions(lang, cityId, toast),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 1, // garbage collect after 1 minute
  });

  return query;
};
