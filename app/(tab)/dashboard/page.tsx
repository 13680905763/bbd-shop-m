"use client";
import { Avatar } from "@heroui/react";
import React from "react";
import { IoChevronForwardSharp, IoSettings } from "react-icons/io5";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { useUser } from "@/services/hooks/useUser";

export default function Cart() {
  const { user, isLoading, isError } = useUser();
  const router = useRouter();

  console.log("user", user);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="flex flex-1 flex-col overflow-auto p-3 scrollbar-hide">
      <div className="flex justify-between px-4">
        <NextLink href="/profile">
          <div className="flex items-center gap-2 text-black">
            <Avatar className="h-[80px] w-[80px]" src={user.avatarUrl} />
            <span className="text-lg font-bold"> {user.name} </span>
          </div>
        </NextLink>
        <div className="flex items-center">
          <NextLink href="/setting">
            <IoSettings className="h-[25px] w-[25px] text-black" />
          </NextLink>
        </div>
      </div>

      <div className="flex px-2 py-4">
        <NextLink
          className="flex flex-1 flex-col items-center justify-center"
          href="/wallet"
        >
          <div className="text-title-xl">888</div>
          <div className="">余额</div>
        </NextLink>
        <NextLink
          className="flex flex-1 flex-col items-center justify-center"
          href="/wallet/score"
        >
          <div className="text-title-xl">888</div>
          <div className="">积分</div>
        </NextLink>
      </div>

      <div className="box-card !mt-0 flex justify-between bg-[url('/m/images/coupon.png')] bg-cover bg-no-repeat py-2 pl-6 pr-2 text-white">
        <div className="items-center">
          <div className="my-1 text-sm font-bold">我的优惠券</div>
          <div className="text-xs">0张优惠券可用</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="">查看全部</span>
          <IoChevronForwardSharp />
        </div>
      </div>

      <div className="box-card flex py-3">
        {siteConfig.orderList.map((item, index) => {
          return (
            <div
              key={item.title}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <div>
                <Avatar radius="md" size="sm" src={item.src} />
              </div>
              <p className="mt-3">{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="box-card bg-[linear-gradient(89deg,_#ffe3df,_#e7f0f0)] p-2">
        <div className="flex justify-between pl-6 pr-2">
          <div className="items-center">
            <div className="my-1 text-sm font-bold">联盟邀请</div>
            <div className="text-xs">已邀请：0 | 激活：0</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/promotion")}>
              <IoChevronForwardSharp />
            </button>
          </div>
        </div>
        <div className="box-card flex bg-white/50 px-2 py-4">
          {siteConfig.affiliatsList.map((item) => (
            <div
              key={item.title}
              className="flex flex-1 flex-col items-center justify-center"
            >
              <div className="text-title-xl">{item.value}</div>
              <div className="">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="box-card p-3">
        <div className="my-1 pl-3 text-sm font-bold">更多服务</div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {siteConfig.dashboardTool.map((item, index) => {
            return (
              <button
                key={item.title}
                className="flex flex-1 flex-col items-center justify-center text-center"
                onClick={() => router.push(item.to)}
              >
                <div>
                  <Avatar radius="md" size="sm" src={item.src} />
                </div>
                <p className="mt-3">{item.title}1</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
