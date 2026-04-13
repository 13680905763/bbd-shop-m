"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { useInvitedUsers } from "@/hook/api";
import { BlockSpinner } from "@/components/ui";
import PaginationBar from "@/components/common/pagination-bar";

export default function InvitedUser() {
  const t = useTranslations("promotion.invitedUser");
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching } = useInvitedUsers({
    current: page,
    size: pageSize,
  });


  const recordList = data?.records || [];


  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-y-auto p-3" >
        <div className="space-y-3">
          {isFetching && <BlockSpinner />}
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
                    className={`rounded-full px-2 py-0.5 text-xs ${item.status === 1
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
        </div>
      </div>
      {recordList.length > 0 && (
        <div className="p-2 flex w-full justify-end bg-white">
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={(data?.total as number) || 0}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </>
  );
}
