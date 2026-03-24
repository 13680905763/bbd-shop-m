"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { useInvitedUsers } from "@/hook/api";
import { FullscreenLoader } from "@/components/ui";

export default function InvitedUser() {
  const t = useTranslations("promotion.invitedUser");
  const router = useRouter();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInvitedUsers();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop - clientHeight < 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const recordList =
    data?.pages?.flatMap((page: any) => page.records || []) || [];

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-y-auto p-3" onScroll={handleScroll}>
        <div className="space-y-3">
          {recordList.map((item: any) => (
            <div
              key={item.id}
              className="home-card flex items-center gap-3 px-4 py-3 shadow-sm transition-all active:scale-[0.99]"
            >
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="truncate text-base font-bold text-gray-900">
                    {item.name}
                  </span>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {item.createTime}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="truncate text-sm text-gray-500">
                    {item.email}
                  </div>
                  <div
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      item.status === 1
                        ? "bg-[#f0700c] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status === 1 ? t("active") : t("inactive")}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!recordList.length && (
            <div className="mt-20 text-center text-gray-500">{t("noData")}</div>
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
