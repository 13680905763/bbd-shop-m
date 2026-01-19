"use client";

import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const TAB_ITEMS = [
  {
    key: "/",
    title: "首页",
    iconPath: "/m/images/home.png",
  },
  {
    key: "/cart",
    title: "购物车",
    iconPath: "/m/images/cart.png",
  },
  {
    key: "/dashboard",
    title: "我的",
    iconPath: "/m/images/user.png",
  },
];

const TabIcon = ({
  active,
  path,
  alt,
}: {
  active: boolean;
  path: string;
  alt: string;
}) => (
  <div className="relative flex flex-col items-center justify-center">
    <Image priority alt={alt} height={24} src={path} width={24} />
    {active && (
      <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
    )}
  </div>
);

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState("/");

  useEffect(() => {
    if (pathname) {
      // 简单的路由匹配逻辑，确保嵌套路由也能高亮对应的 tab
      const matchedTab = TAB_ITEMS.find(
        (tab) =>
          pathname === tab.key ||
          (tab.key !== "/" && pathname.startsWith(tab.key)),
      );

      setActiveKey(matchedTab ? matchedTab.key : pathname);
    }
  }, [pathname]);

  const handleTabClick = (key: string) => {
    if (key !== pathname) {
      router.push(key);
    }
  };

  return (
    <section className="bg flex h-[100dvh] flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide">
        {children}
      </div>
      <TabBar
        activeKey={activeKey}
        className="border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)]"
        onChange={handleTabClick}
      >
        {TAB_ITEMS.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={(active) => (
              <TabIcon active={active} alt={item.title} path={item.iconPath} />
            )}
          />
        ))}
      </TabBar>
    </section>
  );
}
