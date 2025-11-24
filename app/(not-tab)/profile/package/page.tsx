"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { IoCloseCircleOutline, IoSwapHorizontalOutline } from "react-icons/io5";

import ShippingRouteCard from "../../warehouse/submit-warehouse/shipping-route-card";

import PackageItem from "./package-item";

import { usePackageList } from "@/hook";
import {
  batchPayPackage,
  changePayPackage,
  changePrePayPackage,
  refundPayPackage,
  refundPrePayPackage,
  routePackage,
  withdrawPayPackage,
} from "@/services";
import ConfirmModal from "@/components/confirm-modal";
import CommonModal from "@/components/modal/common-modal";
import { queryClient } from "@/lib/react-query";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivde: "206",
};

export default function Settingpage() {
  const t = useTranslations("profile.package");
  const [activeTab, setActiveTab] = useState("all");
  const {
    isLoading,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePackageList(tabKeyToStatusCode[activeTab]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pack = data?.pages?.flatMap((page: any) => page.records) ?? [];

  const [refundConfig, setRefundConfig] = useState<any>(null);
  const [withdrawConfig, setWithdrawConfig] = useState<any>(null);
  const [changeConfig, setChangeConfig] = useState<any>(null);
  const [lineConfig, setLineConfig] = useState<any>(null);

  const allIds = useMemo<string[]>(() => {
    return pack.map((w: any) => w.packingPackageCode) || [];
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

      router.push(`/payment/${bizCode}`);
    } catch {
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

  const onRequestRefund = async (order: any): Promise<void> => {
    console.log("order", order);

    const res = await refundPrePayPackage(order.id);

    setRefundConfig({ ...res, order: order });
  };
  const onRequestChange = async (order: any): Promise<void> => {
    const res = await changePrePayPackage(order.id);

    console.log("changeres", res);

    setChangeConfig(
      res.map((item: any) => {
        return {
          ...item,
          checked: item?.id == order?.shipping?.templateId ? true : false,
          packageId: order?.id,
        };
      }),
    );
  };
  const onRequestLine = async (order: any): Promise<void> => {
    if (!order?.shipping?.shippingCode) {
      addToast({
        title: "当前物流无运输轨迹",
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    const res = await routePackage({
      serverCode: order?.shipping?.serverCode,
      shippingCode: order?.shipping?.shippingCode,
    });

    console.log("onRequestLine", res);

    setLineConfig({ ...res });
  };

  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (!refundConfig) {
      // toast.error("退款配置异常，请稍后重试");
      return;
    }
    try {
      setIsSubmitting(true);

      // 1. 根据不同类型处理不同逻辑
      const bizCode = await refundPayPackage(refundConfig?.param?.id);

      if (bizCode) {
        router.push("/order/pay-order/" + bizCode);
      }
    } catch {
    } finally {
      setIsSubmitting(false);
      // 3. 清空配置
      setRefundConfig(null);
      queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
    }
  };

  const PackageTabContent = ({
    pack,
  }: {
    pack: any[];
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
    if (!pack?.length)
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
          {pack.map((pack: any) => (
            <PackageItem
              key={pack.packingPackageCode}
              activeTab={activeTab}
              pack={pack}
              selected={!!selected[pack.packingPackageCode]}
              onChange={(e: any) => {
                setSelected((prev) => ({
                  ...prev,
                  [pack.packingPackageCode]: e.target.checked,
                }));
              }}
              onRequestChange={() => {
                onRequestChange({ ...pack });
              }}
              onRequestLine={() => {
                onRequestLine({ ...pack });
              }}
              onRequestRefund={() => {
                onRequestRefund({ ...pack });
              }}
              onRequestWithdraw={() => {
                setWithdrawConfig({ ...pack });
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
          <PackageTabContent pack={pack} />
        </Tab>

        <Tab key="pay" title={t("pay")}>
          <PackageTabContent pack={pack} />
        </Tab>

        <Tab key="shipping" title={t("shipping")}>
          <PackageTabContent pack={pack} />
        </Tab>

        <Tab key="receivde" title={t("received")}>
          <PackageTabContent pack={pack} />
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

      {refundConfig && (
        <CommonModal
          // footer={""}
          footer={<div />}
          isOpen={!!refundConfig}
          title={t("refundModal.title")}
          // onConfirm={handleRefundSubmit}
          // title={t("refundTitle")}
          onOpenChange={() => setRefundConfig(null)}
        >
          <div className="flex justify-center gap-6 py-6">
            {/* 确认取消 */}
            <Card
              isPressable
              className="w-52 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-red-500 hover:bg-red-50"
              onPress={() => handleRefundSubmit()}
            >
              <CardBody className="flex flex-col items-center justify-between space-y-3 px-3 py-4 text-center">
                {/* 上半部分：图标与文字 */}
                <div className="flex flex-col items-center space-y-1">
                  {isSubmitting ? (
                    <Spinner color="danger" size="lg" />
                  ) : (
                    <IoCloseCircleOutline className="h-10 w-10 text-red-500" />
                  )}
                  <p
                    className={`text-base font-semibold ${
                      isSubmitting ? "text-gray-500" : "text-red-600"
                    }`}
                  >
                    {isSubmitting
                      ? t("refundModal.cancelCard.submittingTitle")
                      : t("refundModal.cancelCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isSubmitting
                      ? t("refundModal.cancelCard.submittingSubtitle")
                      : t("refundModal.cancelCard.subtitle")}
                  </p>
                </div>

                {/* 下半部分：费用明细 */}
                <div className="w-full rounded-xl border-t border-gray-100 bg-white pt-2 text-sm text-gray-700">
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("refundModal.cancelCard.serviceFee")}</span>
                    <span>
                      {/* {currency.symbol} */}
                      {refundConfig?.serviceFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("refundModal.cancelCard.packingFee")}</span>
                    <span>
                      {/* {currency.symbol} */}
                      {refundConfig?.packingFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                    <span>{t("refundModal.cancelCard.totalFee")}</span>
                    <span>
                      {/* {currency.symbol} */}
                      {refundConfig?.totalFee ?? 0}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 更换路线 */}
            {refundConfig?.order?.changeFlag && (
              <Card
                isPressable
                className="h-auto w-48 border border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                onPress={async () => {
                  await onRequestChange(refundConfig?.order);
                  setRefundConfig(null);
                }}
              >
                <CardBody className="flex flex-col items-center justify-center text-center">
                  <IoSwapHorizontalOutline className="h-8 w-8 text-blue-500" />
                  <p className="text-lg font-semibold text-blue-600">
                    {t("refundModal.changeRouteCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("refundModal.changeRouteCard.subtitle")}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </CommonModal>
      )}
      {changeConfig && (
        <CommonModal
          isOpen={!!changeConfig}
          title={t("changeModal.title")}
          onConfirm={async () => {
            const selected = changeConfig.find((i: any) => i.checked);

            if (!selected) return;

            try {
              const payload = {
                id: selected.packageId,
                templateId: selected.id,
              };

              await changePayPackage(payload);

              await queryClient.invalidateQueries({
                queryKey: ["packageList"],
              });
            } catch {}
          }}
          onOpenChange={() => setChangeConfig(null)}
        >
          {/* 路线 */}
          <div className="flex flex-col gap-2">
            {changeConfig?.map((route: any) => (
              <ShippingRouteCard
                key={route.id}
                isSelected={route?.checked}
                route={route}
                onSelect={(id: any) =>
                  setChangeConfig(
                    changeConfig.map((item: any) => {
                      return {
                        ...item,
                        checked: id == item?.id ? true : false,
                      };
                    }),
                  )
                }
              />
            ))}
          </div>
        </CommonModal>
      )}

      {lineConfig && (
        <CommonModal
          footer={<div />}
          isOpen={!!lineConfig}
          size="4xl"
          title={t("lineModal.title")}
          onOpenChange={() => setLineConfig(null)}
        >
          {/* 滚动区域 */}
          <div className="max-h-[70vh] space-y-8 overflow-y-auto pr-2">
            {/* ========== 主运单基本信息 ========== */}
            <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                {t("lineModal.waybillNumber")}
                <span className="font-medium text-gray-800">
                  {lineConfig?.trackingNumber}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {t("lineModal.currentStatus")}
                <span className="font-medium text-blue-600">
                  {lineConfig?.statusName}
                </span>
              </p>
            </div>

            {/* ========== 主运单时间线 ========== */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t("lineModal.mainTimeline")}
              </h3>

              <div className="relative pl-6">
                {/* 竖线 */}
                <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                {lineConfig?.trackItems?.map((item: any, index: number) => (
                  <div key={index} className="relative mb-6 flex items-start">
                    {/* 时间线圆点 */}
                    <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-blue-500 shadow" />

                    <div className="ml-6">
                      <p className="text-sm font-medium text-gray-800">
                        {item.content}
                      </p>

                      {item.location && (
                        <p className="mt-1 text-xs text-gray-500">
                          {t("lineModal.location")}
                          {item.location}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========== 多个子运单（如果存在） ========== */}
            {Array.isArray(lineConfig?.subOrderList) &&
              lineConfig.subOrderList.length > 0 &&
              lineConfig.subOrderList.map((sub: any) => (
                <div key={sub}>
                  <h3 className="mb-4 text-lg font-semibold">
                    {t("lineModal.subWaybillTitle")}
                    {sub}
                  </h3>

                  <div className="relative pl-6">
                    <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                    {lineConfig.subOrderTrackItems?.[sub]?.map(
                      (item: any, idx: number) => (
                        <div
                          key={idx}
                          className="relative mb-6 flex items-start"
                        >
                          <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-green-500 shadow" />

                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-800">
                              {item.content}
                            </p>

                            {item.location && (
                              <p className="mt-1 text-xs text-gray-500">
                                {t("lineModal.location")}
                                {item.location}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-gray-400">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CommonModal>
      )}

      <ConfirmModal
        content={t("withdrawModal.content")}
        isOpen={!!withdrawConfig}
        onConfirm={async () => {
          if (!withdrawConfig) return;

          try {
            // 调用后端撤销接口，例如 withdrawCancelPackage
            await withdrawPayPackage(withdrawConfig.id);
          } catch {
          } finally {
            setWithdrawConfig(null);
            queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
          }
        }}
        onOpenChange={() => setWithdrawConfig(null)}
      />
    </div>
  );
}
