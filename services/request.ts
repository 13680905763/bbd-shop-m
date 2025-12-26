import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { addToast } from "@heroui/react";

import { ApiResponse } from "@/types";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// console.log(
//   "process.env.NEXT_PUBLIC_API_BASE_URL",
//   process.env.NEXT_PUBLIC_API_BASE_URL,
// );

// 请求拦截器：注入 token、语言等
request.interceptors.request.use(
  (config) => {
    // 🔍 [Debug Log] 请求开始
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        headers: config.headers,
        params: config.params,
        data: config.data
    });

    // const { language, currency } = useGlobalStore.getState();

    // config.headers["X-Language"] = language;
    config.headers["X-Language"] = "zh";

    // config.headers["X-Currency"] = currency.value;
    config.headers["X-Currency"] = "CNY";

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

    // 🔍 [Debug Log] 请求成功
    console.log(`✅ [API Response] ${response.config.url}`, res);

    // console.log("res请求", res);

    const showToast = (response.config as any)?.showToast ?? false; // 默认不显示提示
    const isSuccess = (response.config as any)?.isSuccess ?? true; // 默认不显示提示

    if (!res.success) {
      console.log("接口报错");

      if (showToast) {
        addToast({
          title: res.msg || "请求失败",
          timeout: 1000,
          color: "danger",
        });
      }
      if (!isSuccess) {
        console.log("接口666");

        return res.msg;
      }

      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    if (showToast && isSuccess) {
      addToast({
        title: res.msg || "请求成功",
        timeout: 1000,
        color: "success",
      });
    }

    return res.data; // ✅ 直接返回 data
  },
  (error: AxiosError<any>) => {
    // 🔍 [Debug Log] 请求失败
    console.log(`❌ [API Error] ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
    });

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

      if (typeof window !== "undefined") {
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = `/login?redirect=${encodeURIComponent(
            window.location.pathname,
          )}`;
        }
      }

      return null;
    }

    return Promise.reject(error);
  },
);

// 封装一个带可选参数的请求方法
export const requestWithOption = <T = any>(
  config: AxiosRequestConfig,
  options?: { showToast?: boolean; isSuccess?: boolean },
) => {
  // 设置默认值
  const mergedOptions = {
    showToast: options?.showToast ?? false,
    isSuccess: options?.isSuccess ?? true, // 默认 true，可传 false
  };

  return request({
    ...config,
    showToast: mergedOptions.showToast,
    isSuccess: mergedOptions.isSuccess,
  } as AxiosRequestConfig & {
    showToast?: boolean;
    isSuccess?: boolean;
  }) as Promise<T>;
};
