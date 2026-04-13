"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { useExperience } from "@/hook/api";
import { BlockSpinner } from "@/components/ui";
import PaginationBar from "@/components/common/pagination-bar";

export default function PromotionExperiencePage() {
  const t: any = useTranslations("promotion.experiencePage");
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isFetching } = useExperience({
    current: page,
    size: pageSize,
  });

  const recordList = data?.records || [];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 space-y-3 overflow-y-auto p-3 scrollbar-hide">
        {isFetching && <BlockSpinner />}
        {recordList.map((item: any) => (
          <div
            key={item.id}
            className="home-card flex flex-col gap-2 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#f0700c]">
                + {item.experience}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{item.createTime}</span>
            </div>
          </div>
        ))}
        {!recordList.length && (
          <div className="mt-20 text-center text-gray-500">{t("noData")}</div>
        )}
      </div>
      {recordList.length > 0 && (
        <div className="flex w-full justify-end bg-white p-2">
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
