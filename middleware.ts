// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// 移动端公开访问页面
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api",
  "/register",
  "/m/products",
  "/m/product",
];

// 判断是否公开路径
function isPublicPath(pathname: string) {
  // 先判断是不是严格等于 /m
  if (pathname === "/m") return true;

  // 然后判断是否在其他公开路径或其子路径
  return PUBLIC_PATHS.some(
    (path) =>
      path !== "/m" && (pathname === path || pathname.startsWith(path + "/")),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authorization")?.value;

  console.log("进入中间件");

  // console.log(
  //   "文件信息:",
  //   token,
  //   pathname,
  //   pathname.startsWith("/_next/"),
  //   !token,
  //   isPublicPath(pathname),
  // );
  // ✅ 如果是公开页面，放行（但已登录用户访问 login/register 则跳首页）
  if (isPublicPath(pathname)) {
    console.log("公开页面放行");
    console.log(
      "文件信息:",
      token,
      pathname,
      pathname.startsWith("/_next/"),
      !token,
      isPublicPath(pathname),
    );
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/m/dashboard", request.url));
    }

    return NextResponse.next();
  }
  if (pathname.startsWith("/api/")) {
    console.log("api开头", pathname);

    return NextResponse.redirect(new URL("/m", request.url));
  }
  // ❌ 非公开页面，未登录就跳转到登录页
  if (!token) {
    console.log("未登录", pathname);

    const loginUrl = new URL("/m/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ✅ 默认放行
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next|.*\\..*).*)", // 不拦截 API 路由、静态资源、favicon
  ],
};
