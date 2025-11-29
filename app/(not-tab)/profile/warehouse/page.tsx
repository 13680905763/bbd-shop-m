"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Spinner, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import WarehouseItem from "./warehouse-item";

import { useWarehouseList } from "@/hook";
import { createWarehousePreviewKeyByCart } from "@/services";
import { useSelection } from "@/hook/useSelection";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  submit: "302",
};

export default function Warehouse() {
  const t = useTranslations("profile.warehouse"); // ✅ 命名空间

  // 传入订单状态，例如 "ALL"、"WAIT_PAY"
  const [activeTab, setActiveTab] = useState("all");
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error,
  } = useWarehouseList(tabKeyToStatusCode[activeTab]);

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const router = useRouter();
  const warehouse = data?.pages?.flatMap((page: any) => page.records) ?? [];

  // ================= 使用 useSelection =================
  const {
    selectedIds,
    isSelected,
    hasSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
  } = useSelection(warehouse, { idKey: "packageCode" });
  // 提交
  const handleWarehouseSubmit = async () => {
    try {
      setIsSubmitting(true); // ✅ 开始loading

      const key = await createWarehousePreviewKeyByCart({
        packageSet: selectedIds,
      });

      router.push(`/submit/warehouse?key=${key}`);
    } catch {
    } finally {
      setIsSubmitting(false); // ✅ 恢复
    }
  };

  const WarehouseTabContent = ({ warehouse }: { warehouse: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!warehouse?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-lg text-gray-500">
          {t("noOrders")}
        </div>
      );

    return (
      <>
        {isFetching && !isFetchingNextPage && (
          <Spinner className="mb-2 flex justify-center text-gray-500" />
        )}
        <div className="flex flex-col gap-3">
          {warehouse.map((w: any) => (
            <WarehouseItem
              key={w.id}
              activeTab={activeTab}
              selected={isSelected(w.packageCode)}
              warehouse={w}
              onChange={() => toggle(w.packageCode)}
            />
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
    <div className="flex h-screen flex-col justify-between bg-[#f7f8f9]">
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>

      <Tabs
        aria-label="Options"
        classNames={{
          base: " w-full bg-white p-1",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
          tab: " px-0 h-12 flex-1",
          cursor: "h-0",
          tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
          panel: "bg-[#f7f8f9] px-2 flex-1 overflow-auto ",
        }}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(String(key))}
      >
        <Tab key="all" title={t("tabs.all")}>
          <WarehouseTabContent warehouse={warehouse} />
        </Tab>

        <Tab key="submit" title={t("tabs.submit")}>
          <WarehouseTabContent warehouse={warehouse} />
        </Tab>
      </Tabs>

      {activeTab == "submit" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            {/* 全选 */}
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
                  {t("selectAll")}
                </Checkbox>
              </div>
            </div>

            {/* 批量支付按钮 */}
            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isSubmitting}
                onPress={handleWarehouseSubmit}
              >
                {t("submitPackages")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
