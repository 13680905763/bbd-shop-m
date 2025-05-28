"use client";
import React from "react";
import { NavBar, Image } from "antd-mobile";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
const PrivilegeCard = ({ active = false }) => (
  <div className={`flex-1 ${active ? "bg-[#fff5f3]" : "bg-[#f8f8f8]"}`}>
    <div
      className={`w-full h-12 flex flex-col items-center justify-center text-[0.75rem] font-bold ${active ? "text-[#c92910]" : "text-[#333]"}`}
    >
      <div>Bronze Affiliate</div>
      {/* {active && <FaGem className="text-[#c92910]" size={17} />} */}
    </div>
    <div className="w-full py-[0.9375rem] text-center">
      <div className="text-sm text-[#999]">奖金率</div>
      <div className="font-bold text-[1.125rem] text-[#333] my-[0.625rem]">
        4%
      </div>
      <div className="text-sm text-[#999]">5000积分</div>
    </div>
  </div>
);

export default function Settingpage() {
  const router = useRouter();
  const stepList = [
    { text: "分享您的联盟代码" },
    { text: "您邀请的朋友确认后，您将收到联盟佣金" },
    { text: "收到您的联盟佣金" },
  ];
  const moneyList = [
    {
      title: "邀请的用户",
      value: "$888",
      to: "/pages/member/account/index",
    },
    {
      title: "可提现",
      value: "88",
      to: "/pages/member/score/index",
    },
    {
      title: "已赚取",
      value: "88",
      to: "/pages/member/score/index",
    },
  ];
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className=" bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        联盟会员
      </NavBar>
      <div>
        <Image src="/images/promotion.png" />

        <div className="p-2">
          <div className="w-[16.25rem] flex items-center justify-between relative mx-auto mb-[0.625rem] after:content-[''] after:absolute after:w-full after:border-b after:border-dashed after:border-[#c92910] after:z-[1]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative w-5 h-5 rounded-full bg-white font-bold text-xs text-[#c92910] flex items-center justify-center z-[2]"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="w-[22.1875rem] flex items-center mx-auto">
            {stepList.map((item, index) => (
              <div
                key={index}
                className="w-[7.5rem] h-16 font-normal text-[0.6875rem] text-[#333] text-center flex  justify-center text-wrap text-xs"
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className="box-card flex flex-col items-center gap-2 p-2">
            <div className="p-2 bg-[#f5f5f5] w-full">
              https://cnfans.com/register/?ref=3582377
            </div>
            <Button className="w-full" color="primary">
              一键复制
            </Button>
            <div className="text-xs font-normal leading-[1.125rem] text-[#999999]">
              复制这个链接，并使用它将用户重定向到我们的主页，同时带有您的联盟ID。
            </div>
          </div>
          <div className="text-center box-card p-2">
            <div className="text-[24px] font-bold text-[#f3643a] my-[10px]">
              CAD 0.00
            </div>
            <div className="text-sm text-[#999]">总奖励</div>
            <div className="flex px-[10px] py-[15px] border-b border-[#eeeeee] justify-center">
              <button className="rounded-full flex-1 py-2 border border-[#ccc] text-sm">
                记录
              </button>
              <div className="w-[20px]" />
              <button className="rounded-full flex-1 py-2 bg-[#f0700c] text-white text-sm">
                提现
              </button>
            </div>

            <div className="grid grid-cols-3 my-4">
              {moneyList.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  //   href={item.to}
                >
                  <div className="text-base font-bold mb-1">{item.value}</div>
                  <div className="text-sm text-[#999]">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 box-card p-2 pt-4">
            <div className="flex justify-between pb-0 text-base font-medium">
              <div>我的特权</div>
              <div className="text-sm text-[#999] flex items-center gap-1">
                {/* <IoIosHelpCircleOutline
                  onClick={handleHelpClick}
                  className="cursor-pointer"
                /> */}
                积分: 0
              </div>
            </div>

            <div className="flex justify-around border border-[#eeeeee] rounded-md mt-[0.9375rem] overflow-hidden">
              <PrivilegeCard active />
              <PrivilegeCard />
              <PrivilegeCard />
            </div>
          </div>
          <div className="p-2 box-card ">
            <div className="p-4 font-bold ">权益FAQ</div>
            <Accordion className="!border-1" variant="bordered">
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="什么是联盟会员计划？"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="2"
                aria-label="Accordion 2"
                title="我的奖金是如何计算的？"
              >
                {defaultContent}
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Accordion 3"
                title="如何免费推广？"
              >
                {defaultContent}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
