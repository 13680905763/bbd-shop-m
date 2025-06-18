import axios from "axios";

// 你也可以从全局状态或 cookie 中读取 token / lang
function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

function getLang() {
  if (typeof window === "undefined") return "en";

  return localStorage.getItem("lang") || "en";
}

// 创建 axios 实例
export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 如果你用 Next.js 接口代理，这里可以是空或 '/api'
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 请求拦截器：注入 token、语言等
request.interceptors.request.use(
  (config) => {
    config.headers["Language"] = "ZH";
    config.headers["Currency"] = "CNY";
    // const token = getToken();
    const lang = getLang();

    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    if (lang) {
      config.headers["Accept-Language"] = lang;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => response.data, // 统一返回 data 字段
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 未登录或 token 过期
      console.warn("未授权，请重新登录");
      // 比如跳转登录页
    } else if (status >= 500) {
      console.error("服务器错误，请稍后重试");
    }

    return Promise.reject(error);
  },
);

// 👉 用于 SWR 的 fetcher
export const fetcher = (url: string) =>
  request.get(url).then((res) => res.data);
