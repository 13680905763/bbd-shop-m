"use client";
import React, { useEffect, useState } from "react";
import { NavBar, Image } from "antd-mobile";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { getExperience, getPromotionConfig } from "@/services";
const PrivilegeCard = ({ active = false }) => (
  <div className={`flex-1 ${active ? "bg-[#fff5f3]" : "bg-[#f8f8f8]"}`}>
    <div
      className={`flex h-12 w-full flex-col items-center justify-center text-[0.75rem] font-bold ${active ? "text-[#c92910]" : "text-[#333]"}`}
    >
      <div>Bronze Affiliate</div>
      {/* {active && <FaGem className="text-[#c92910]" size={17} />} */}
    </div>
    <div className="w-full py-[0.9375rem] text-center">
      <div className="text-sm text-[#999]">奖金率</div>
      <div className="my-[0.625rem] text-[1.125rem] font-bold text-[#333]">
        4%
      </div>
      <div className="text-sm text-[#999]">5000积分</div>
    </div>
  </div>
);

export default function Settingpage() {
  const router = useRouter();
  const [experience, setExperience] = useState<any>(null);

  const [promotionConfig, setPromotionConfig] = useState([]);
  const fetchExperience = async () => {
    try {
      const res = await getExperience();
      const res1 = await getPromotionConfig();

      setPromotionConfig(res1);
      setExperience(res || null);
    } catch {
    } finally {
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);
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
      to: "/pages/member/points/index",
    },
    {
      title: "已赚取",
      value: "88",
      to: "/pages/member/points/index",
    },
  ];
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        联盟会员
      </NavBar>
      <div>
        <Image src="/m/images/promotion.png" />

        <div className="p-2">
          <div className="relative mx-auto mb-[0.625rem] flex w-[16.25rem] items-center justify-between after:absolute after:z-[1] after:w-full after:border-b after:border-dashed after:border-[#c92910] after:content-['']">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative z-[2] flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#c92910]"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mx-auto flex w-[22.1875rem] items-center">
            {stepList.map((item, index) => (
              <div
                key={index}
                className="flex h-16 w-[7.5rem] justify-center text-wrap text-center text-[0.6875rem] text-xs font-normal text-[#333]"
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className="box-card flex flex-col items-center gap-2 p-2">
            <div className="w-full bg-[#f5f5f5] p-2">
              https://bbdbuy.com/register/?ref=3582377
            </div>
            <Button className="w-full" color="primary">
              一键复制
            </Button>
            <div className="text-xs font-normal leading-[1.125rem] text-[#999999]">
              复制这个链接，并使用它将用户重定向到我们的主页，同时带有您的联盟ID。
            </div>
          </div>
          <div className="box-card p-2 text-center">
            <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
              CAD 0.00
            </div>
            <div className="text-sm text-[#999]">总奖励</div>
            <div className="flex justify-center border-b border-[#eeeeee] px-[10px] py-[15px]">
              <button className="flex-1 rounded-full border border-[#ccc] py-2 text-sm">
                记录
              </button>
              <div className="w-[20px]" />
              <button className="flex-1 rounded-full bg-[#f0700c] py-2 text-sm text-white">
                提现
              </button>
            </div>

            <div className="my-4 grid grid-cols-3">
              {moneyList.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  //   href={item.to}
                >
                  <div className="mb-1 text-base font-bold">{item.value}</div>
                  <div className="text-sm text-[#999]">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="box-card p-2 px-4 pt-4">
            <div className="flex justify-between pb-0 text-base font-medium">
              <div>我的等级</div>
              <div className="flex items-center gap-1 text-sm text-[#999]">
                {/* <IoIosHelpCircleOutline
                  onClick={handleHelpClick}
                  className="cursor-pointer"
                /> */}
                积分: 0
              </div>
            </div>

            <div className="flex overflow-hidden rounded-lg border border-[#eeeeee] bg-[#f7f8f9]">
              {promotionConfig.map((item: any, index) => (
                <div
                  key={item.id}
                  className={`flex flex-1 flex-col items-center justify-center border-l border-[#eeeeee] first:border-l-0 ${
                    index === 0 ? "bg-[#ffeee1]" : "bg-white"
                  }`}
                >
                  {/* 奖金比例标题 */}
                  <div className="py-4 text-center text-lg font-semibold text-[#f0700c]">
                    {item.rangeCode}
                  </div>

                  {/* 奖金详情 */}
                  <div className="flex flex-col items-center gap-1 py-4">
                    <div className="text-sm text-gray-500">奖金比例</div>
                    <div className="text-base font-bold text-[#f0700c]">
                      {(Number(item.configValue) * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.rangeMin} ~ {item.rangeMax} 经验
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="box-card p-2">
            <div className="p-4 font-bold">权益FAQ</div>
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
