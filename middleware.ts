// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// 移动端公开访问页面
const PUBLIC_PATHS = [
  "/m",
  "/m/login",
  "/m/register",
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
  console.log("middleware");

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authorization")?.value;

  console.log("pathname:", pathname);

  console.log("token:", token, pathname, !token, isPublicPath(pathname));

  // 放行静态资源
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images/")
  ) {
    return NextResponse.next();
  }

  // ✅ 如果是公开页面，放行（但已登录用户访问 login/register 则跳首页）
  if (isPublicPath(pathname)) {
    if (token && (pathname === "/m/login" || pathname === "/m/register")) {
      return NextResponse.redirect(new URL("/m/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ❌ 非公开页面，未登录就跳转到登录页
  if (!token) {
    console.log("未登录");

    const loginUrl = new URL("/m/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ✅ 默认放行
  return NextResponse.next();
}

export const config = {
  matcher: ["/m", "/m/:path*"],
};
