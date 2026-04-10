import axios, { AxiosResponse, AxiosError } from "axios";

import { ApiResponse } from "@/types";
import { useGlobalStore } from "@/store";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 请求拦截器：注入 token、语言等
request.interceptors.request.use(
  (config) => {
    const { language, currency } = useGlobalStore.getState();

    config.headers["X-Language"] = language;
    config.headers["X-Currency"] = currency.value;
    config.headers["X-Timezone"] = "Asia/Shanghai";
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);
// 响应拦截器：统一处理响应结构
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const res = response.data;


    // 业务逻辑失败
    if (!res.success) {
      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    // 成功直接返回数据
    return res.data || res.msg;
  },
  (error: AxiosError<any>) => {
    // 先获取 config，并扩展类型
    const status = error.response?.status;

    if (status == 401) {
      // addToast({ title: "please login first", color: "danger" });
      return Promise.reject(null);
    }

    return Promise.reject(error);
  },
);
