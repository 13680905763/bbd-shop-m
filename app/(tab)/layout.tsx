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
    setActiveKey(pathname || "/");
  }, [pathname]);
  const tabs = [
    {
      key: "/",
      title: "首页",
      icon: (active: boolean) => (
        <div className="flex flex-col items-center justify-center relative">
          <Image
            priority
            alt="home"
            height={24}
            src={"/m/images/home.png"}
            width={24}
          />
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
    },

    {
      key: "/cart",
      title: "购物车",
      icon: (active: boolean) => (
        <div className="flex flex-col items-center justify-center relative">
          <Image
            priority
            alt="cart"
            height={24}
            src={"/m/images/cart.png"}
            width={24}
          />
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
    },
    {
      key: "/dashboard",
      title: "我的",
      icon: (active: boolean) => (
        <div className="flex flex-col items-center justify-center relative">
          <Image
            priority
            alt="user"
            height={24}
            src={"/m/images/user.png"}
            width={24}
          />
          {active && (
            <div className="absolute -bottom-2 h-1 w-6 rounded-full bg-[#f0700c]" />
          )}
        </div>
      ),
    },
  ];
  const handleTabClick = (key: string) => {
    if (key !== pathname) {
      router.push(key);
    }
  };

  return (
    <section className="bg flex h-[calc(var(--vh)_*_100)] flex-col justify-between">
      {children}
      <TabBar
        activeKey={activeKey}
        className="bg-white"
        onChange={handleTabClick}
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={item.icon(activeKey === item.key)}
          />
        ))}
      </TabBar>
    </section>
  );
}
