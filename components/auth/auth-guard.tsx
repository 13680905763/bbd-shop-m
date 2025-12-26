"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store";

// 需要登录的路由前缀
const PROTECTED_PATHS = [
  "/profile",
  "/wallet",
  "/payment",
  "/submit",
  "/setting",
  "/dashboard",
  "/cart",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  useEffect(() => {
    // 检查是否在受保护的路由
    const isProtected = PROTECTED_PATHS.some((path) =>
      pathname?.startsWith(path),
    );

    // 如果在受保护路由且未登录，重定向到登录页
    if (isProtected && !user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
      router.replace(loginUrl);
    }
  }, [pathname, user, router]);

  // 可以选择在检查期间显示 loading，或者直接渲染 children（会有一瞬间的闪烁，但在 useEffect 中跳转是 Next.js 常用做法）
  // 为了用户体验，如果确定未登录且在保护路由，可以暂时返回 null
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname?.startsWith(path),
  );
  if (isProtected && !user) {
    return null; // 或者返回一个 Loading 组件
  }

  return <>{children}</>;
}
