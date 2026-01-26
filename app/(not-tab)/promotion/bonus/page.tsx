"use client";

import React, { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { useBonus } from "@/hook/api";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";


export default function PromotionBonusPage() {
  const t: any = useTranslations("promotion.bonus");
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBonus();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop - clientHeight < 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const recordList = data?.pages?.flatMap((page: any) => page.records || []) || [];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-y-auto p-3 scrollbar-hide" onScroll={handleScroll}>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recordList.map((item: any) => (
              <div
                key={item.id}
                className="home-card flex flex-col gap-2 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-base">
                    {item.bizType}
                  </span>
                  <span className="font-bold text-lg text-[#f0700c]">
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{t("tableColumns.currentBalance")}: {item.currentBalance}</span>
                  <span>{item.createTime}</span>
                </div>
              </div>
            ))}
            {!recordList.length && (
              <div className="mt-20 text-center text-gray-500">
                {t("noData")}
              </div>
            )}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-sm text-gray-500">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
