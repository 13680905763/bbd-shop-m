"use client";
import React from "react";
import { NavBar, Image } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Accordion, AccordionItem } from "@heroui/react";

import { CopyText } from "@/components/ui";
import { useBonusConfig } from "@/hook/api";
import { useGlobalStore } from "@/store";
import { useUserExperience, useUserInfo } from "@/hook/business";

export default function Promotion() {
  const t = useTranslations("promotion");
  const router = useRouter();
  const { currency } = useGlobalStore();

  const { data: user, isLoading, error } = useUserInfo();
  const { data: experience, isLoading: isLoadingExperience } =
    useUserExperience();
  const { data: bonusConfig, isLoading: isLoadingBonusConfig } =
    useBonusConfig();

  const process = [t("process1"), t("process2"), t("process3")];
  const faq = [
    {
      question: t("question1"),
      answer: t("answer1"),
    },
    {
      question: t("question2"),
      answer: t("answer2"),
    },
    {
      question: t("question3"),
      answer: t("answer3"),
    },
  ];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <Image src="/m/images/promotion.png" />
        <div className="space-y-2 p-2">
          <div className="relative mx-auto mb-[0.625rem] flex w-[16.25rem] items-center justify-between after:absolute after:z-[1] after:w-full after:border-b after:border-dashed after:border-[#c92910] after:content-['']">
            {process.map((item, idx) => (
              <div
                key={item}
                className="relative z-[2] flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#c92910]"
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <div className="mx-auto flex w-[22.1875rem] items-center">
            {process.map((item, idx) => (
              <div
                key={item}
                className="flex h-20 w-[7.5rem] justify-center text-wrap text-center text-[0.6875rem] text-xs font-normal text-[#333]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-2">
            <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#f4f4f5] px-4 py-2.5 text-[#11181C] transition-colors hover:bg-[#e4e4e7]">
              <span className="break-all font-mono text-sm">
                {`https://www.bbdbuy1.com/register?inviteCode=${user?.inviteCode || ""}`}
              </span>
            </div>
            <CopyText
              className="w-full"
              text={`https://www.bbdbuy1.com/register?inviteCode=${user?.inviteCode || ""}`}
            >
              <button className="w-full rounded-lg bg-[#f0700c] py-2.5 text-sm font-medium text-white">
                {t("copy")}
              </button>
            </CopyText>
            <span className="text-xs font-normal leading-[1.125rem] text-[#999999]">
              {t("processTip")}
            </span>
          </div>

          <div className="rounded-xl bg-white p-2 text-center">
            <div className="text-3xl font-bold text-[#f0700c]">
              {currency.symbol}
              {user?.myBonus}
            </div>
            <div>{t("totalReward")}</div>
            <div className="col-span-2 grid grid-cols-3 mt-4">
              <div className="text-center">
                <div>{user?.inviteCount}</div>
                <button
                  className="hover:text-[#f0700c]"
                  onClick={() => router.push("/promotion/invitedUser")}
                >
                  {t("inviteUsers")}
                </button>
              </div>
              <div className="text-center">
                <div>{user?.activeUsersCount || 0}</div>
                <button
                  className="hover:text-[#f0700c]"
                // onClick={() => router.push("/promotion/experience")}
                >
                  {t("activeUsersCount")}
                </button>
              </div>
              <div className="text-center">
                <div>{experience?.experience || 0}</div>
                <button
                  className="hover:text-[#f0700c]"
                  onClick={() => router.push("/promotion/experience")}
                >
                  {t("experience")}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-white p-2 px-4">
            <div className="subtitle">{t("title2")}</div>

            <div className="flex overflow-hidden rounded-lg border border-[#eeeeee] bg-[#f7f8f9]">
              {bonusConfig?.map((item: any, index: any) => (
                <div
                  key={item.id}
                  className={`flex flex-1 flex-col items-center justify-center border-l border-[#eeeeee] first:border-l-0 ${index === 0 ? "bg-[#ffeee1]" : "bg-white"
                    }`}
                >
                  <div className="py-4 text-center text-lg font-semibold text-[#f0700c]">
                    {item.rangeCode}
                  </div>
                  <div className="flex flex-col items-center gap-1 py-4 text-center">
                    <div className="text-sm text-gray-500">
                      {t("bonusRate")}
                    </div>
                    <div className="text-base font-bold text-[#f0700c]">
                      {(Number(item.configValue) * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.rangeMin} ~ {item.rangeMax} {t("experienceRange")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="box-card p-2">
            <div className="p-4 font-bold">{t("title3")}</div>
            <Accordion className="!border-1" variant="bordered">
              {faq.map((item) => (
                <AccordionItem
                  key={item.question}
                  aria-label={item.question}
                  title={item.question}
                >
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
