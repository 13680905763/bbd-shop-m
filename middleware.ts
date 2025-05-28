// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// 设置不需要登录的路径白名单
const PUBLIC_PATHS = ["/", "/login", "/register", "/product", "/products"];
const AUTH_PAGES = ["/login", "/register"]; // 仅登录注册页

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(publicPath + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authorization")?.value;

  console.log("token", !!token);

  // 如果是公开页面，直接放行
  if (isPublicPath(pathname)) {
    if (token && ["/login", "/register"].includes(pathname)) {
      console.log("已经登录还来登录页");

      // 用户已登录，访问登录页等公开页，重定向回首页
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }
  if (
    pathname.startsWith("/_next/") || // Next.js 内置静态资源
    pathname.startsWith("/static/") || // 你的其他静态资源目录（如果有）
    pathname === "/favicon.ico" || // favicon.ico 文件
    pathname.startsWith("/images/") // 你放在 public/images 下的图片
  ) {
    console.log("静态资源放行");

    return NextResponse.next();
  }
  // 如果没登录，跳转到登录页
  if (!token) {
    const loginUrl = new URL("/login", request.url);

    console.log("loginUrl", loginUrl, pathname);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ 匹配所有页面
export const config = {
  matcher: [
    // 匹配所有页面
    "/((?!_next|api|static|favicon.ico|robots.txt).*)",
  ],
};
