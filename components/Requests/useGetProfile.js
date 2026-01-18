'use client';

import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../lib/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

class UnauthorizedError extends Error {
  isUnauthorized = true;
  constructor(message = "unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

let redirecting = false;

function burnSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("device_id");
  localStorage.removeItem("fcm_token");
  Cookies.remove("token");
}

const fetchProfile = async (lang) => {
  const token = Cookies.get("token");

  const headers = {
    lang,
    secretKey: "6a72f384a1d3bcb40c0129e810ce4d7b9e83d7aaf208b3ecfd0488d6a1e5c67a",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, { headers });

    // ✅ API returns { key: "unauthorized" } even if HTTP is 200
    if (response?.data?.key === "unauthorized") {
      throw new UnauthorizedError();
    }

    return response.data.data;
  } catch (err) {
    // ✅ Also handle real 401
    const status = err?.response?.status;
    const key = err?.response?.data?.key;

    if (status === 401 || key === "unauthorized") {
      throw new UnauthorizedError();
    }

    throw err;
  }
};

export const useGetProfile = (lang) => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["profile", lang],
    queryFn: () => fetchProfile(lang),
    staleTime: 1000 * 5,
    gcTime: 1000 * 60,

    // ✅ STOP the 3 retries when unauthorized
    retry: (failureCount, error) => {
      if (error?.isUnauthorized) return false;
      return failureCount < 2; // (اختياري) خليها 2 أو 0 لو عايز
    },
  });

  // ✅ Single redirect + burn session immediately
  useEffect(() => {
    if (query.error && (query.error)?.isUnauthorized && !redirecting) {
      redirecting = true;
      burnSession();
      router.replace("/login");
    }
  }, [query.error, router]);

  return query;
};
