"use client";
import { Spinner, Tab, Tabs } from "@heroui/react";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { usePointsList } from "@/hook/wallet/usePointsList";
import { getUserInfo } from "@/services";

export default function Settingpage() {
  const t = useTranslations("wallet.points");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
    isLoading,
  } = usePointsList();
  const records = data?.pages?.flatMap((page: any) => page?.records) ?? [];
  // 获取用户信息
  const fetchUser = async () => {
    try {
      const res = await getUserInfo();

      setUser(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const PointsRecordContent = ({ records }: { records: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!records?.length)
      return (
        <div className="flex h-[60vh] flex-1 flex-col items-center justify-center text-lg text-gray-500">
          {t("noMoreRecords")}
        </div>
      );

    return (
      <>
        {isFetching && !isFetchingNextPage && (
          <Spinner className="mb-2 flex justify-center text-gray-500" />
        )}
        <div className="flex flex-1 flex-col gap-2">
          {records.map((r: any) => (
            <div
              key={r?.id}
              className="rounded-lg bg-white px-4 py-3 shadow-sm transition-shadow"
            >
              <div className="flex justify-between">
                {/* 左侧 */}
                <div className="flex flex-col gap-1">
                  <div className="text-title !text-base font-medium text-gray-800">
                    {r?.bizType}
                  </div>
                  <div className="text-sm text-gray-500">{r?.createTime}</div>
                </div>

                {/* 右侧 */}
                <div className="flex flex-col items-end gap-1">
                  <p className="text-money-xl font-semibold text-green-600">
                    {r?.amount > 0 ? `+${r?.amount}` : r?.amount}
                  </p>
                  {r?.status && (
                    <p className="text-sm text-gray-400">{r?.status}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && (
            <div className="text-center text-[#999]">{t("noMoreRecords")}</div>
          )}
          {isFetchingNextPage && <Spinner />}
        </InfiniteScroll>
      </>
    );
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="m-2 flex rounded-lg bg-[#ffeee1] p-6">
        <div className="flex flex-1 items-center gap-2">
          <IoWallet className="h-5 w-5 text-[#f0700c]" />
          <div>{t("myPoints")}</div>
          <div className="flex items-center gap-2">
            <span className="text-balance">{user?.myPoints}</span>
          </div>
        </div>
      </div>

      <Tabs
        aria-label="Options"
        classNames={{
          base: "w-full bg-white p-1",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
          cursor: "w-full bg-[#f0700c] ",
          tab: " px-0 h-12 flex-1",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
          panel: "flex flex-col flex-1 overflow-auto scrollbar-hide",
        }}
        variant="underlined"
      >
        <Tab key="photos" title={t("pointsDetail")}>
          <PointsRecordContent records={records} />
        </Tab>

        <Tab key="videos" title={t("pointsExchange")}>
          {/* 可在这里添加积分兑换内容 */}
          <div />
        </Tab>
      </Tabs>
    </>
  );
}
