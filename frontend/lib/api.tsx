"use client";
import axios from "axios";

export const api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Silently refresh access token on 401, then retry the original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once and only on 401 (don't retry the refresh call itself)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/signin") &&
      !originalRequest.url?.includes("/auth/signup")
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // Retry the original failed request with the new access token cookie
        return api(originalRequest);
      } catch {
        // Refresh failed — redirect to sign in only if not on a public page
        if (typeof window !== "undefined") {
          const publicPaths = ["/", "/auth/signin", "/auth/signup"];
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = "/auth/signin";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);