import axios, { AxiosResponse } from "axios";
import { addToast } from "@heroui/react";

import { ApiResponse } from "@/types";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 支持 cookie 登录
});
// 请求拦截器：注入 token、语言等
request.interceptors.request.use(
  (config) => {
    config.headers["X-Language"] = "en";
    config.headers["X-Currency"] = "USD";
    config.headers["X-Timezone"] = "Asia/Shanghai";

    return config;
  },
  (error) => Promise.reject(error),
);
// 拦截器统一处理响应结构
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const res = response.data;

    if (!res.success) {
      // 统一处理后端自定义错误码
      addToast({
        title: res.msg || "请求失败",
        timeout: 1000,
        color: "danger",
      });

      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    return res.data; // ✅ 直接返回后端 data 字段
  },
  (error) => {
    // 统一处理 HTTP 状态错误
    const status = error.response?.status;

    if (status === 401) {
      console.warn("未登录，请重新登录");
      // 可以跳转登录页或清除本地状态
    }

    return Promise.reject(error);
  },
);
