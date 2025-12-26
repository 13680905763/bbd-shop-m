// app/not-found.tsx 或 app/not-found/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.log("404页面被访问");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          页面未找到
        </h2>
        <p className="mb-8 max-w-md text-gray-600">
          抱歉，您访问的页面不存在或已被移动。
        </p>
        <div className="space-x-4">
          <button
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            onClick={() => router.push("/")}
          >
            返回首页
          </button>
          <button
            className="inline-block rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
            onClick={() => window.history.back()}
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
