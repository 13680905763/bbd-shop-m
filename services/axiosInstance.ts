import axios from "axios";

// import { getToken } from "@/utils/auth"; // 你自己实现的token获取方法

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 生产/开发自动切换
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 请求拦截器 - token注入
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = getToken();
    // const token = 666;

    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器 - 错误处理等
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 你可以统一处理401，弹提示等
    if (error.response?.status === 401) {
      // 例如跳转登录，清理token等
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
