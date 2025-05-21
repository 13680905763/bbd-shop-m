"use client";
import { TabBar } from "antd-mobile";
import { IoCart, IoHome, IoPersonCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";

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
      icon: <IoHome />,
    },

    {
      key: "/cart",
      title: "购物车",
      icon: <IoCart />,
    },
    {
      key: "/dashboard",
      title: "我的",
      icon: <IoPersonCircle />,
    },
  ];

  return (
    <section className="bg-[url('/bg.png')] bg-no-repeat bg-cover bg-center flex flex-col justify-between h-[100vh]">
      {children}
      <TabBar className="bg-white" safeArea={true}>
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
