"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import PackageItem from "./package-item";

import { usePackageList } from "@/hook";
import { batchPayPackage } from "@/services";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivde: "206",
};

export default function Settingpage() {
  const t = useTranslations("Profile.PackagePage");
  const [activeTab, setActiveTab] = useState("all");
  const { data, fetchNextPage, hasNextPage } = usePackageList(
    tabKeyToStatusCode[activeTab],
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const warehouse = data?.pages?.flatMap((page: any) => page.records) ?? [];

  const allIds = useMemo<string[]>(() => {
    return warehouse.map((w: any) => w.packingPackageCode) || [];
  }, [data]);

  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 &&
      allIds.every((packingPackageCode) => selected[packingPackageCode])
    );
  }, [allIds, selected]);

  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(
      allIds.map((packingPackageCode) => [packingPackageCode, checked]),
    );

    setSelected(newSelected);
  };

  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  const handleWarehouseSubmit = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsSubmitting(true);
      const bizCode = await batchPayPackage({
        packageSet: selectedIds,
      });

      router.push(`/order/pay-order/${bizCode}`);
    } catch (error) {
      console.error("批量支付失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        {t("navbar")}
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
          {warehouse?.map((pack: any) => (
            <PackageItem
              key={pack.packingPackageCode}
              activeTab={activeTab}
              pack={pack}
              texts={t.raw("texts")}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
          />
        </Tab>

        <Tab key="pay" title={t("pay")}>
          <>
            <div className="flex flex-col gap-3">
              {warehouse?.map((pack: any) => (
                <PackageItem
                  key={pack.packingPackageCode}
                  activeTab={activeTab}
                  pack={pack}
                  selected={!!selected[pack.packingPackageCode]}
                  texts={t.raw("texts")}
                  onChange={(e: any) => {
                    setSelected((prev) => ({
                      ...prev,
                      [pack.packingPackageCode]: e.target.checked,
                    }));
                  }}
                />
              ))}
            </div>
            <InfiniteScroll
              hasMore={!!hasNextPage}
              loadMore={() => fetchNextPage().then(() => undefined)}
            />
          </>
        </Tab>

        <Tab key="shipping" title={t("shipping")}>
          <div className="flex flex-col gap-3">
            {warehouse?.map((pack: any) => (
              <PackageItem
                key={pack.packingPackageCode}
                activeTab={activeTab}
                pack={pack}
                texts={t.raw("texts")}
              />
            ))}
          </div>
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={() => fetchNextPage().then(() => undefined)}
          />
        </Tab>

        <Tab key="receivde" title={t("received")}>
          <div className="flex flex-col gap-3">
            {warehouse?.map((pack: any) => (
              <PackageItem
                key={pack.packingPackageCode}
                activeTab={activeTab}
                pack={pack}
                texts={t.raw("texts")}
              />
            ))}
          </div>
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={() => fetchNextPage().then(() => undefined)}
          />
        </Tab>
      </Tabs>

      {activeTab == "pay" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
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

            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={selectedIds.length === 0}
                isLoading={isSubmitting}
                onPress={handleWarehouseSubmit}
              >
                {t("submitPay")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
