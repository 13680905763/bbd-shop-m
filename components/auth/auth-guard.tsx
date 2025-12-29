"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useUserStore } from "@/store";
import { getUserInfo } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";

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
  const { user, setUser } = useUserStore();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 检查是否在受保护的路由
      const isProtected = PROTECTED_PATHS.some((path) =>
        pathname?.startsWith(path),
      );

      console.log(
        "路由拦截",
        "是否保护路由",
        isProtected,
        "store是否存在",
        !user,
        "路由路径",
        pathname,
      );
      // 如果在受保护路由且未登录
      if (isProtected && !user) {
        setIsChecking(true);
        try {
          // 尝试获取用户信息，确认是否真的未登录（可能是刷新页面导致 Store 丢失但 Cookie 还在）
          const userInfo = await getUserInfo();

          console.log("userInfo", userInfo);
          setUser(userInfo);
          // 获取成功，放行
        } catch (error) {
          // 获取失败，确实未登录，重定向
          const loginUrl = `/login?redirect=${encodeURIComponent(
            pathname || "/",
          )}`;
          router.replace(loginUrl);
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkAuth();
  }, [pathname, user, router, setUser]);

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname?.startsWith(path),
  );

  // 如果在受保护路由，且没有用户信息，正在检查中 -> 显示 Loading
  if (isProtected && !user && isChecking) {
    return <FullscreenLoader />;
  }

  // 如果在受保护路由，且没有用户信息，且检查完毕（失败了） -> 返回 null（等待跳转）
  if (isProtected && !user && !isChecking) {
    return null;
  }

  return <>{children}</>;
}
