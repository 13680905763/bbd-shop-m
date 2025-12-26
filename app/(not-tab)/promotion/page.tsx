"use client";
import React, { useEffect, useState } from "react";
import { NavBar, Image } from "antd-mobile";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getExperience, getPromotionConfig } from "@/services";

export default function Promotion() {
  const { t } = useTranslation("translation", {
    keyPrefix: "promotion",
  });
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
      // handle error
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return (
    <>
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-y-auto bg-[#f5f5f5] p-2">
        <Image
          alt={t("promotionImageAlt")}
          className="w-full object-contain" // 关键：保持比例，不裁剪
          src="/images/promotion.png"
        />

        {/* 步骤条 */}
        <div className="relative mx-auto mb-[0.625rem] flex w-[16.25rem] items-center justify-between after:absolute after:z-[1] after:w-full after:border-b after:border-dashed after:border-[#c92910] after:content-['']">
          {["step1", "step2", "step3"].map((key, idx) => (
            <div
              key={key}
              className="relative z-[2] flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#c92910]"
            >
              {idx + 1}
            </div>
          ))}
        </div>

        <div className="mx-auto flex w-[22.1875rem] items-center">
          {["step1", "step2", "step3"].map((key) => (
            <div
              key={key}
              className="flex h-16 w-[7.5rem] justify-center text-wrap text-center text-[0.6875rem] text-xs font-normal text-[#333]"
            >
              {t(`steps.${key}`)}
            </div>
          ))}
        </div>

        {/* 推荐链接 */}
        <div className="box-card flex flex-col items-center gap-2 p-2">
          <div className="w-full bg-[#f5f5f5] p-2">
            https://bbdbuy.com/register/?ref=3582377
          </div>
          <Button className="w-full" color="primary">
            {t("referralLink.copyButton")}
          </Button>
          <div className="text-xs font-normal leading-[1.125rem] text-[#999999]">
            {t("referralLink.desc")}
          </div>
        </div>

        {/* 总奖励 */}
        <div className="box-card p-2 text-center">
          <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
            {t("totalReward.amount")}
          </div>
          <div className="text-sm text-[#999]">{t("totalReward.label")}</div>
          <div className="flex justify-center border-b border-[#eeeeee] px-[10px] py-[15px]">
            <button className="flex-1 rounded-full border border-[#ccc] py-2 text-sm">
              {t("totalReward.recordButton")}
            </button>
            <div className="w-[20px]" />
            <button className="flex-1 rounded-full bg-[#f0700c] py-2 text-sm text-white">
              {t("totalReward.withdrawButton")}
            </button>
          </div>

          <div className="my-4 grid grid-cols-3">
            {["inviteUser", "withdrawable", "earned"].map((key) => (
              <div key={key} className="flex flex-col items-center">
                <div className="mb-1 text-base font-bold">
                  {t(`moneyList.${key}.value`)}
                </div>
                <div className="text-sm text-[#999]">
                  {t(`moneyList.${key}.title`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 我的等级 */}
        <div className="box-card p-2 px-4 pt-4">
          <div className="flex justify-between pb-0 text-base font-medium">
            <div>{t("myLevel.label")}</div>
            <div className="flex items-center gap-1 text-sm text-[#999]">
              {t("myLevel.points")}
            </div>
          </div>

          {/* 奖金配置 */}
          <div className="flex overflow-hidden rounded-lg border border-[#eeeeee] bg-[#f7f8f9]">
            {promotionConfig.map((item: any, index) => (
              <div
                key={item.id}
                className={`flex flex-1 flex-col items-center justify-center border-l border-[#eeeeee] first:border-l-0 ${
                  index === 0 ? "bg-[#ffeee1]" : "bg-white"
                }`}
              >
                <div className="py-4 text-center text-lg font-semibold text-[#f0700c]">
                  {item.rangeCode}
                </div>
                <div className="flex flex-col items-center gap-1 py-4">
                  <div className="text-sm text-gray-500">
                    {t("promotionConfig.bonusLabel")}
                  </div>
                  <div className="text-base font-bold text-[#f0700c]">
                    {(Number(item.configValue) * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.rangeMin} ~ {item.rangeMax}{" "}
                    {t("promotionConfig.experienceLabel")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="box-card p-2">
          <div className="px-4 font-bold">{t("faq.title")}</div>
          <Accordion className="!border-1" variant="bordered">
            {["item1", "item2", "item3"].map((key) => (
              <AccordionItem
                key={key}
                aria-label={t(`faq.${key}.question`)}
                title={t(`faq.${key}.question`)}
              >
                {t(`faq.${key}.answer`)}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
