// app/api/[...slug]/route.ts
import { NextRequest } from "next/server";
// 构造统一的代理处理函数
async function handleProxy(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const { slug } = await params; // 2. 必须先 await
    const targetUrl = new URL(req.url);
    // 拼接出你最终要请求的真实后端地址
    const backendUrl = `https://dev.bbdbuy1.com/api/${slug.join("/")}${targetUrl.search}`;
    console.log("🚀🚀🚀 代理正在运行:", backendUrl);
    // 复制请求头（去掉 host 防止被目标服务器拒绝）
    const headers = new Headers(req.headers);
    headers.delete("host");
    try {
        // 1. 发起真实请求
        const res = await fetch(backendUrl, {
            method: req.method,
            headers,
            // 如果不是 GET/HEAD，处理 request body 的流
            body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.blob(),
            redirect: "manual",
        });
        // 2. 拿到后端的响应头
        const responseHeaders = new Headers(res.headers);
        const setCookieValue = responseHeaders.get("set-cookie");
        if (setCookieValue) {
            // 3. 【执行你的核心逻辑】
            // 将 Domain=dev.bbdbuy1.com; 替换掉或者直接清空，浏览器默认就会存在 localhost 下！
            // 也顺便清空 Secure，以防有的时候 localhost http 下出问题
            let newCookie = setCookieValue
                .replace(/Domain=[^;]+;?/gi, "")
                .replace(/Secure;?/gi, "");

            responseHeaders.set("set-cookie", newCookie);
        }
        // 4. 将被修改过的头连同后端 body 一并返回给浏览器
        return new Response(res.body, {
            status: res.status,
            statusText: res.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("代理发生错误:", error);
        return new Response(JSON.stringify({ msg: "Proxy Error", success: false }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
// 导出所支持的方法
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;