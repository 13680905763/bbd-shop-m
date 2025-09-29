import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { addToast } from "@heroui/react";

import { ApiResponse } from "@/types";
import { useGlobalStore } from "@/store";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 请求拦截器：注入 token、语言等
request.interceptors.request.use(
  (config) => {
    const { locale, currency } = useGlobalStore.getState();

    config.headers["X-Language"] = locale;
    config.headers["X-Currency"] = currency;
    // config.headers["X-Language"] = "en";
    // config.headers["X-Currency"] = "USD";
    config.headers["X-Timezone"] = "Asia/Shanghai";

    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一处理响应结构
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any> & { config?: any }>) => {
    const res = response.data;

    const showToast = (response.config as any)?.showToast ?? false; // 默认不显示提示

    if (!res.success) {
      if (showToast) {
        addToast({
          title: res.msg || "请求失败",
          timeout: 1000,
          color: "danger",
        });
      }

      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    if (showToast) {
      addToast({
        title: res.msg || "请求成功",
        timeout: 1000,
        color: "success",
      });
    }

    return res.data; // ✅ 直接返回 data
  },
  (error: AxiosError<any>) => {
    // 先获取 config，并扩展类型
    const config = error.config as any;
    const showToast = config?.showToast ?? false;

    const status = error.response?.status;

    if (status === 401) {
      if (showToast) {
        addToast({ title: "未登录", timeout: 1000, color: "danger" });
      }
      localStorage.removeItem("user-storage");
      localStorage.removeItem("wallet-storage");
      localStorage.removeItem("services-storage");
      localStorage.removeItem("billingAddress-storage");

      return null;
    }

    return Promise.reject(error);
  },
);

// 封装一个带可选参数的请求方法
export const requestWithOption = <T = any>(
  config: AxiosRequestConfig,
  options?: { showToast?: boolean },
) => {
  return request({
    ...config,
    ...(options ? { showToast: options.showToast } : {}),
  } as AxiosRequestConfig & { showToast?: boolean }) as Promise<T>;
};
