"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import WarehouseItem from "./warehouse-item";

import { BlockSpinner, EmptyState } from "@/components/ui";
import { BottomAction, CommonTabs } from "@/components/common";
import { useCreateWaybillPreview, useWarehousePackageList } from "@/hook/api";
import { useSelection } from "@/hook/common";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  submit: "302",
};

export default function Warehouse() {
  const t = useTranslations("profile.warehouse"); // ✅ 命名空间
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useWarehousePackageList({
      statusCode: tabKeyToStatusCode[activeTab],
      size: 10,
    });
  const warehouse = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const { mutateAsync: createPreview, isPending: isSubmitting } =
    useCreateWaybillPreview();
  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(warehouse, { idKey: "packageCode" });
  // 提交
  const handleWarehouseSubmit = async () => {
    try {
      const key = await createPreview(selectedIds);

      router.push(`/submit/warehouse?key=${key}`);
    } catch {}
  };
  const renderWarehouseContent = () => {
    if (!warehouse?.length && !isFetching) return <EmptyState />;

    return (
      <>
        {isFetching && <BlockSpinner />}
        <div className="space-y-2">
          {warehouse.map((w: any) => (
            <WarehouseItem
              key={w.id}
              isSelected={isSelected}
              showCheckbox={activeTab == "submit"}
              warehouse={w}
              onChange={onSelect}
            />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && <EmptyState className="!h-auto" />}
        </InfiniteScroll>
      </>
    );
  };
  const tabs = [
    {
      key: "all",
      title: t("tabs.all"),
      content: renderWarehouseContent(),
    },
    {
      key: "submit",
      title: t("tabs.submit"),
      content: renderWarehouseContent(),
    },
  ];

  return (
    <>
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key) => setActiveTab(String(key))}
      />
      {activeTab == "submit" && warehouse.length > 0 && (
        <BottomAction
          // buttonText={t("sumbit")}
          isAllSelected={isAllSelected}
          isLoading={isSubmitting}
          selectedCount={selectedIds.length}
          onPress={() => handleWarehouseSubmit()}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
    </>
  );
}
