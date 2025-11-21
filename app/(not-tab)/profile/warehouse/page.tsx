"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Spinner, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import WarehouseItem from "./warehouse-item";

import { useWarehouseList } from "@/hook";
import { createWarehousePreviewKeyByCart } from "@/services";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  submit: "302",
};

export default function Settingpage() {
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

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const router = useRouter();
  const warehouse = data?.pages?.flatMap((page: any) => page.records) ?? [];

  // const onPayOrderRedirect = (bizCode: string) => {
  //   router.push(`/order/pay-order/${bizCode}`);
  // };
  const allIds = useMemo<string[]>(() => {
    return warehouse.map((w: any) => w.packageCode) || [];
  }, [data]);
  // 是否全选
  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 && allIds.every((packageCode) => selected[packageCode])
    );
  }, [allIds, selected]);

  // 切换全选
  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(
      allIds.map((packageCode) => [packageCode, checked]),
    );

    setSelected(newSelected);
  };
  // 选中的 orderCode
  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  // 提交
  const handleWarehouseSubmit = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsSubmitting(true); // ✅ 开始loading

      const key = await createWarehousePreviewKeyByCart({
        packageSet: selectedIds,
      });

      router.push("/warehouse/submit-warehouse?key=" + key);
    } catch {
    } finally {
      setIsSubmitting(false); // ✅ 恢复
    }
  };

  // 初始化选中状态
  useEffect(() => {
    if (data?.pages) {
      const initialSelected: Record<string, boolean> = data.pages.reduce(
        (acc: any, item: any) => {
          acc[item.packageCode] = false;

          return acc;
        },
        {} as Record<string, boolean>,
      );

      setSelected(initialSelected);
    }
  }, [data]);

  const WarehouseTabContent = ({
    warehouse,
  }: {
    warehouse: any[];
    footer?: React.ReactNode;
  }) => {
    // console.log("isLoading", isLoading);
    // console.log("!warehouse?.length", warehouse?.length);

    if (isLoading)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
          <div className="mb-2 text-lg">
            <Spinner />
          </div>
        </div>
      );
    if (!warehouse?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
          <p className="mb-2 text-lg">{t("noOrders")}</p>
        </div>
      );

    return (
      <>
        {isFetching && !isFetchingNextPage && (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="mb-2 text-lg">
              <Spinner />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {warehouse.map((warehouse: any) => (
            <WarehouseItem
              key={warehouse.id}
              activeTab={activeTab}
              selected={!!selected[warehouse.packageCode]}
              warehouse={warehouse}
              onChange={(e: any) => {
                setSelected((prev) => ({
                  ...prev,
                  [warehouse.packageCode]: e.target.checked,
                }));
              }}
            />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && (
            <div
              style={{
                textAlign: "center",
                padding: "12px 0",
                color: "#999",
              }}
            >
              {t("noMoreRecords")}
            </div>
          )}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <div className="mb-2 text-lg">
                <Spinner />
              </div>
            </div>
          )}
        </InfiniteScroll>
      </>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
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
          panel: "bg-[#f7f8f9] px-2 flex-1",
        }}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(String(key))}
      >
        <Tab key="all" title={t("all")}>
          <WarehouseTabContent warehouse={warehouse} />
        </Tab>

        <Tab key="submit" title={t("submit")}>
          <WarehouseTabContent warehouse={warehouse} />
        </Tab>
      </Tabs>

      {activeTab == "submit" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            {/* 全选 */}
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Checkbox
                  isSelected={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                >
                  {t("selectAll")}
                </Checkbox>
              </div>
            </div>

            {/* 批量支付按钮 */}
            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={selectedIds.length === 0}
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
