"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
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

import ShippingRouteCard from "../../submit/warehouse/shipping-route-card";

import PackageItem from "./package-item";

import { usePackageList } from "@/hook";
import {
  batchPayPackage,
  changePayPackage,
  changePrePayPackage,
  ReceiptPackage,
  refundPayPackage,
  refundPrePayPackage,
  routePackage,
  withdrawPayPackage,
} from "@/services";
import ConfirmModal from "@/components/confirm-modal";
import CommonModal from "@/components/modal/common-modal";
import { queryClient } from "@/lib/react-query";
import { useSelection } from "@/hook/useSelection";
import { useGlobalStore } from "@/store";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivde: "206",
};

type ModalType = "cancel" | "revoke" | "changeLine" | "line" | "receipt" | null;
interface ModalState {
  type: ModalType;
  confirm?: () => Promise<void>;
  order?: any; // 退款 modal 可能需要 order 数据
  currentPackage?: any; // 退款 modal 选中商品信息
  cancelPre?: any; //取消预览
  linePre?: any; //路线预览
  lineDetails?: any; //路线详情
}
export default function Settingpage() {
  const t = useTranslations("profile.package");
  const { currency } = useGlobalStore();

  const [activeTab, setActiveTab] = useState("all");
  const {
    isLoading,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = usePackageList(tabKeyToStatusCode[activeTab]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const router = useRouter();
  const packageList = data?.pages?.flatMap((page: any) => page.records) ?? [];

  const [modal, setModal] = useState<ModalState>({ type: null });

  // ================= 使用 useSelection =================
  const {
    selectedIds,
    isSelected,
    hasSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
  } = useSelection(packageList, { idKey: "packingPackageCode" });

  // 打开取消弹窗
  const openCancelModal = async (currentPackage: any) => {
    const res = await refundPrePayPackage(currentPackage?.id);

    setModal({
      type: "cancel",
      confirm: async () => {
        try {
          setIsSubmitting(true);
          const bizCode = await refundPayPackage(currentPackage?.id);

          console.log("bizCode", bizCode);

          await queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
          setIsSubmitting(false);
          setModal({ type: null });
          if (bizCode) router.push("/payment/" + bizCode);
        } catch {
        } finally {
        }
      },
      currentPackage,
      cancelPre: res,
    });
  };
  // 打开撤销退款弹窗
  const openRevokeModal = (packageId: string) => {
    setModal({
      type: "revoke",
      confirm: async () => {
        // 调用后端撤销接口
        await withdrawPayPackage(packageId);
        await queryClient.invalidateQueries({ queryKey: ["packageList"] });
        setModal({ type: null });
      },
    });
  };
  // 打开收货弹窗
  const openReceiptModal = (packageId: string) => {
    setModal({
      type: "receipt",
      confirm: async () => {
        // 调用后端撤销接口
        await ReceiptPackage(packageId);
        await queryClient.invalidateQueries({ queryKey: ["packageList"] });
        setModal({ type: null });
      },
    });
  };
  // 打开跟换路线弹窗
  const openChangeLineModal = async (currentPackage: any) => {
    const res = await changePrePayPackage(currentPackage.id);

    setModal({
      type: "changeLine",
      linePre: res.map((item: any) => {
        return {
          ...item,
          checked:
            item?.id == currentPackage?.shipping?.templateId ? true : false,
          packageId: currentPackage?.id,
        };
      }),
    });
  };
  // 提交跟换路线
  const handleChangeLine = async () => {
    const selected = modal.linePre.find((i: any) => i.checked);

    if (!selected) return;
    const payload = {
      id: selected.packageId,
      templateId: selected.id,
    };

    await changePayPackage(payload);
    await queryClient.invalidateQueries({ queryKey: ["packageList"] });
    setModal({ type: null });
  };

  // 打开路线详情弹窗
  const openLineModal = async (currentPackage: any) => {
    const res = await routePackage({
      serverCode: currentPackage?.shipping?.serverCode,
      shippingCode: currentPackage?.shipping?.shippingCode,
    });

    console.log("line", res);

    setModal({
      type: "line",
      confirm: async () => {
        setModal({ type: null });
      },
      lineDetails: res,
    });
  };
  const handleWarehouseSubmit = async () => {
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

  const PackageTabContent = ({ packageList }: { packageList: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!packageList?.length)
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
          {packageList.map((p: any) => (
            <PackageItem
              key={p.packingPackageCode}
              activeTab={activeTab}
              pack={p}
              selected={isSelected(p.packingPackageCode)}
              onCancelPackage={() => openCancelModal(p)} //取消包裹预览
              onChange={() => toggle(p.packingPackageCode)}
              onChangePackageLine={() => openChangeLineModal(p)} //变更路线预览
              onLine={() => {
                openLineModal(p);
              }} // 路线详情
              onPayPackageRedirect={async () => {
                const bizCode = await batchPayPackage({
                  packageSet: [p?.packingPackageCode],
                });

                if (bizCode) router.push(`/payment/${bizCode}`);
              }} //支付
              onReceiptPackage={() => {
                openReceiptModal(p?.id);
              }} //收货
              onRevokePackage={() => openRevokeModal(p?.id)} //撤回取消包裹
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
        <Tab key="all" title={t("tabs.all")}>
          <PackageTabContent packageList={packageList} />
        </Tab>

        <Tab key="pay" title={t("tabs.pay")}>
          <PackageTabContent packageList={packageList} />
        </Tab>

        <Tab key="shipping" title={t("tabs.shipping")}>
          <PackageTabContent packageList={packageList} />
        </Tab>

        <Tab key="receivde" title={t("tabs.received")}>
          <PackageTabContent packageList={packageList} />
        </Tab>
      </Tabs>

      {activeTab == "pay" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
                  {t("selectAll")}
                </Checkbox>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isSubmitting}
                onPress={handleWarehouseSubmit}
              >
                {t("submitPay")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 取消弹窗 */}
      {modal.type === "cancel" && (
        <CommonModal
          isOpen
          footer={<div />}
          title={t("cancelModal.title")}
          onOpenChange={() => setModal({ type: null })}
        >
          <div className="flex justify-center gap-6 py-6">
            <Card
              isPressable
              className="w-52 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-red-500 hover:bg-red-50"
              onPress={() => {
                if (modal.confirm) modal.confirm();
              }}
            >
              <CardBody className="flex flex-col items-center justify-between space-y-3 px-3 py-4 text-center">
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
                      ? t("cancelModal.cancelCard.submittingTitle")
                      : t("cancelModal.cancelCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isSubmitting
                      ? t("cancelModal.cancelCard.submittingSubtitle")
                      : t("cancelModal.cancelCard.subtitle")}
                  </p>
                </div>

                {/* 下半部分：费用明细 */}
                <div className="w-full rounded-xl border-t border-gray-100 bg-white pt-2 text-sm text-gray-700">
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("cancelModal.cancelCard.serviceFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.serviceFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("cancelModal.cancelCard.packingFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.packingFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                    <span>{t("cancelModal.cancelCard.totalFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.totalFee ?? 0}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 更换路线 */}
            {modal?.currentPackage?.changeFlag && (
              <Card
                isPressable
                className="h-auto w-48 border border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                onPress={async () => {
                  setIsSubmittingChange(true);

                  await openChangeLineModal(modal?.currentPackage);
                  setIsSubmittingChange(false);
                }}
              >
                <CardBody className="flex flex-col items-center justify-center text-center">
                  {isSubmittingChange ? (
                    <Spinner color="danger" size="lg" />
                  ) : (
                    <IoSwapHorizontalOutline className="h-8 w-8 text-blue-500" />
                  )}

                  <p className="text-lg font-semibold text-blue-600">
                    {t("cancelModal.changeRouteCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("cancelModal.changeRouteCard.subtitle")}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </CommonModal>
      )}

      {/* 撤回弹窗 */}
      {modal.type === "revoke" && (
        <ConfirmModal
          isOpen
          content={t("withdrawContent")}
          title={t("withdrawTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {/* 收货弹窗 */}
      {modal.type === "receipt" && (
        <ConfirmModal
          isOpen
          content={t("receiptContent")}
          title={t("receiptTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {/* 跟换路线弹窗 */}
      {modal.type === "changeLine" && (
        <CommonModal
          isOpen
          title={t("changeTitle")}
          onConfirm={handleChangeLine}
          onOpenChange={() => setModal({ type: null })}
        >
          {/* 路线 */}
          <div className="flex flex-col gap-2">
            {modal?.linePre?.map((route: any) => (
              <ShippingRouteCard
                key={route.id}
                isSelected={route?.checked}
                route={route}
                onSelect={(id: any) =>
                  setModal({
                    ...modal,
                    linePre: modal?.linePre?.map((item: any) => {
                      return {
                        ...item,
                        checked: id == item?.id ? true : false,
                      };
                    }),
                  })
                }
              />
            ))}
          </div>
        </CommonModal>
      )}

      {modal.type === "line" && (
        <CommonModal
          isOpen
          footer={<div />}
          size="2xl"
          title={t("lineModal.title")}
          onOpenChange={() => setModal({ type: null })}
        >
          {/* 滚动区域 */}
          <div className="max-h-[60vh] space-y-8 overflow-y-auto pr-2">
            {/* ========== 主运单基本信息 ========== */}
            <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                {t("lineModal.waybillNumber")}
                <span className="font-medium text-gray-800">
                  {modal?.lineDetails?.trackingNumber}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {t("lineModal.currentStatus")}
                <span className="font-medium text-[#f0700c]">
                  {modal?.lineDetails?.statusName}
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

                {modal?.lineDetails?.trackItems?.map(
                  (item: any, index: number) => (
                    <div key={index} className="relative mb-6 flex items-start">
                      {/* 时间线圆点 */}
                      <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-[#f0700c] shadow" />

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

            {/* ========== 多个子运单（如果存在） ========== */}
            {Array.isArray(modal?.lineDetails?.subOrderList) &&
              modal?.lineDetails.subOrderList.length > 0 &&
              modal?.lineDetails.subOrderList.map((sub: any) => (
                <div key={sub}>
                  <h3 className="mb-4 text-lg font-semibold">
                    {t("lineModal.subWaybillTitle")}
                    {sub}
                  </h3>

                  <div className="relative pl-6">
                    <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                    {modal?.lineDetails.subOrderTrackItems?.[sub]?.map(
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
    </div>
  );
}
