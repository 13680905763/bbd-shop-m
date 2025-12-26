"use client";
import { TabBar } from "antd-mobile";
import { useRouter, usePathname } from "next/navigation";
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
    setActiveKey(pathname || "/");
  }, [pathname]);

  const tabs = [
    {
      key: "/",
      icon: (active: boolean) => (
        <div className="flex items-center justify-center">
          <Image
            priority
            alt="home"
            className="transition-opacity duration-200"
            height={24}
            src={active ? "/images/tabbar/home.png" : "/images/tabbar/home.png"}
            width={24}
          />
        </div>
      ),
      badge: null,
    },
    {
      key: "/cart",
      icon: (active: boolean) => (
        <div className="relative flex items-center justify-center">
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
        </div>
      ),
      badge: null,
    },
    {
      key: "/dashboard",
      icon: (active: boolean) => (
        <div className="flex items-center justify-center">
          <Image
            priority
            alt="profile"
            className="transition-opacity duration-200"
            height={24}
            src={active ? "/images/tabbar/user.png" : "/images/tabbar/user.png"}
            width={24}
          />
        </div>
      ),
      badge: null,
    },
  ];

  const handleTabClick = (key: string) => {
    if (key !== pathname) {
      router.push(key);
    }
  };

  return (
    <section className="bgimg flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="px-3">{children}</div>

      {/* 🎯 底部导航栏 - 固定在底部，带安全区域 */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white">
        <TabBar activeKey={activeKey} safeArea={true} onChange={handleTabClick}>
          {tabs.map((item) => (
            <TabBar.Item
              key={item.key}
              badge={item.badge}
              icon={item.icon(activeKey === item.key)}
            />
          ))}
        </TabBar>
      </footer>
    </section>
  );
}
