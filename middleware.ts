// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// 移动端公开访问页面
const PUBLIC_PATHS = ["/", "/login", "/register", "/goods"];

// // 判断是否公开路径
function isPublicPath(pathname: string) {
  // 然后判断是否在其他公开路径或其子路径
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("JWTC")?.value;

  console.log("进入中间件---路由是：", pathname);
  console.log("token是否存在 ", !!token);
  console.log("是否是公开页面", isPublicPath(pathname));

  // ✅ 如果是公开页面，放行（但已登录用户访问 login/register 则跳首页）
  if (isPublicPath(pathname)) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      console.log("有token不准进入登录页，跳转会个人中心");

      return NextResponse.redirect(new URL("/m/dashboard", request.url));
    }

    const res = NextResponse.next();

    res.headers.set("Cache-Control", "no-store");

    return res;
  }

  // ❌ 非公开页面 + 未登录 → 跳转登录页
  if (!isPublicPath(pathname) && !token) {
    console.log("未登录", pathname);
    const loginUrl = new URL("/m/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);

    redirectRes.headers.set("Cache-Control", "no-store");

    return redirectRes;
  }

  // ✅ 默认放行
  const res = NextResponse.next();

  res.headers.set("Cache-Control", "no-store");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // 不拦截 静态资源、favicon
  ],
};
