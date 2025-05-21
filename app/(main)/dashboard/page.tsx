"use client";
import { Avatar } from "@heroui/react";
import React from "react";
import { IoChevronForwardSharp, IoSettings } from "react-icons/io5";

import { siteConfig } from "@/config/site";

export default function Cart() {
  return (
    <div className="p-3">
      <div className="flex justify-between px-4">
        <div className="flex items-center gap-2">
          <Avatar
            size="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          />
          <span className="text-lg font-bold"> Bryant </span>
        </div>
        <div className="flex  items-center">
          <IoSettings className="w-[25px] h-[25px]" />
        </div>
      </div>

      <div className="flex py-4 px-2">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-title-xl">888</div>
          <div className="">余额</div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="text-title-xl">888</div>
          <div className="">积分</div>
        </div>
      </div>

      <div className="box-card flex justify-between bg-[url('/coupon.png')] bg-no-repeat bg-cover py-2 pl-6 pr-2 text-white !mt-0">
        <div className=" items-center ">
          <div className="  text-sm font-bold my-1">我的优惠券</div>
          <div className="  text-xs ">0张优惠券可用</div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="">查看全部</span>
          <IoChevronForwardSharp />
        </div>
      </div>

      <div className="flex py-3 box-card">
        {siteConfig.orderList.map((item, index) => {
          return (
            <div
              key={item.title}
              className="text-center flex-1 flex justify-center items-center flex-col"
            >
              <div>
                <Avatar radius="md" src={item.src} />
              </div>
              <p className="mt-3">{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="box-card  p-2 bg-[linear-gradient(89deg,_#ffe3df,_#e7f0f0)]">
        <div className="flex justify-between  pl-6 pr-2">
          <div className=" items-center ">
            <div className="  text-sm font-bold my-1">联盟邀请</div>
            <div className="  text-xs ">已邀请：0 | 激活：0</div>
          </div>
          <div className="flex gap-2 items-center">
            <IoChevronForwardSharp />
          </div>
        </div>
        <div className="flex py-4 px-2 box-card bg-white/50">
          {siteConfig.affiliatsList.map((item) => (
            <div
              key={item.title}
              className="flex-1 flex flex-col justify-center items-center"
            >
              <div className="text-title-xl">{item.value}</div>
              <div className="">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className=" p-3 box-card">
        <div className="pl-3 text-sm font-bold my-1">更多服务</div>

        <div className=" mt-4 grid grid-cols-3 gap-4">
          {siteConfig.dashboardTool.map((item, index) => {
            return (
              <div
                key={item.title}
                className="text-center flex-1 flex justify-center items-center flex-col"
              >
                <div>
                  <Avatar radius="md" src={item.src} />
                </div>
                <p className="mt-3">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
