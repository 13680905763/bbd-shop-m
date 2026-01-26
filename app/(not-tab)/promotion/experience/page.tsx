"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { useExperience } from "@/hook/api";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";
import { FullscreenLoader } from "@/components/ui";

export default function PromotionExperiencePage() {
  const t: any = useTranslations("promotion.experiencePage");
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useExperience();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop - clientHeight < 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const recordList = data?.pages?.flatMap((page: any) => page.records || []) || [];
  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-y-auto p-3 scrollbar-hide " onScroll={handleScroll}>

        <div className="space-y-3 srcollbar-hide">
          {recordList.map((item: any) => (
            <div
              key={item.id}
              className="home-card flex flex-col gap-2 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-[#f0700c]">
                  + {item.experience}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
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
      </div>
    </>
  );
}
