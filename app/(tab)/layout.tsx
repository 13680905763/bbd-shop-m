"use client";
import { TabBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const tabs = [
    {
      key: "/",
      title: "首页",
      icon: (
        <Image
          priority
          alt="home"
          height={24}
          src="/m/images/home.png"
          width={24}
        />
      ),
    },

    {
      key: "/cart",
      title: "购物车",
      icon: (
        <Image
          priority
          alt="home"
          height={24}
          src="/m/images/cart.png"
          width={24}
        />
      ),
    },
    {
      key: "/dashboard",
      title: "我的",
      icon: (
        <Image
          priority
          alt="home"
          height={24}
          src="/m/images/user.png"
          width={24}
        />
      ),
    },
  ];

  return (
    <section className="bg flex h-[calc(var(--vh)_*_100)] flex-col justify-between">
      {children}
      <TabBar className="bg-white">
        {tabs.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            onClick={() => router.push(item.key)}
          />
        ))}
      </TabBar>
    </section>
  );
}
