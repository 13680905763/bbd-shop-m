"use client";
import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState("/");

  // 监听路由变化，更新选中的tab
  useEffect(() => {
    // 移除尾部斜杠（除了根路径 "/"）
    let currentPath = pathname || "/";

    if (currentPath !== "/" && currentPath.endsWith("/")) {
      currentPath = currentPath.slice(0, -1);
    }

    setActiveKey(currentPath);
  }, [pathname]);

  const tabs = [
    {
      key: "/",
      icon: (active: boolean) => (
        <div className="relative flex flex-col items-center justify-center">
          <Image
            priority
            alt="home"
            className="transition-opacity duration-200"
            height={24}
            src={active ? "/images/tabbar/home.png" : "/images/tabbar/home.png"}
            width={24}
          />
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
      badge: null,
    },
    {
      key: "/cart",
      icon: (active: boolean) => (
        <div className="relative flex flex-col items-center justify-center">
          <Image
            priority
            alt="cart"
            className="transition-opacity duration-200"
            height={24}
            src={active ? "/images/tabbar/cart.png" : "/images/tabbar/cart.png"}
            width={24}
          />
          {/* 购物车数量徽章示例 */}
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
      badge: null,
    },
    {
      key: "/dashboard",
      icon: (active: boolean) => (
        <div className="relative flex flex-col items-center justify-center">
          <Image
            priority
            alt="profile"
            className="transition-opacity duration-200"
            height={24}
            src={active ? "/images/tabbar/user.png" : "/images/tabbar/user.png"}
            width={24}
          />
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
      badge: null,
    },
  ];

  const handleTabClick = (key: string) => {
    console.log("点击事件 key", key);
    console.log("此时 pathname", pathname);

    if (key !== pathname) {
      router.push(key);
    }
  };

  return (
    <section className="bgimg flex h-[100dvh] flex-col justify-between pt-[env(safe-area-inset-top)]">
      {children}
      <TabBar
        activeKey={activeKey}
        className="bg-white"
        safeArea={true}
        onChange={handleTabClick}
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.key}
            badge={item.badge}
            icon={item.icon(activeKey === item.key)}
          />
        ))}
      </TabBar>
    </section>
  );
}
