"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PackageItem from "./package-item";
import CancelModal from "./cancel-modal";
import ChangeLineModal from "./change-line-modal";
import LineDetailModal from "./line-detail-modal";

import { useSelection, useConfirm } from "@/hook/common";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { BottomAction, CommonTabs } from "@/components/common";
import {
  useBatchPay,
  useCancelWaybill,
  useChangeLine,
  usePreviewCancel,
  usePreviewChangeLine,
  useReceipt,
  useTrackDetail,
  useWaybillList,
  useWithdrawCancel,
} from "@/hook/api/useWaybill";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivde: "206",
};

type ModalType = "cancel" | "changeLine" | "line" | "receipt" | null;
interface ModalState {
  type: ModalType;
  confirm?: () => Promise<void>;
  order?: any; // 退款 modal 可能需要 order 数据
  currentPackage?: any; // 退款 modal 选中商品信息
  cancelPre?: any; //取消预览
  linePre?: any; //路线预览
  lineDetails?: any; //路线详情
}
export default function WaybillPage() {
  const t = useTranslations("profile.package");

  const [activeTab, setActiveTab] = useState("all");
  const { data, fetchNextPage, hasNextPage, isFetching } = useWaybillList({
    size: 10,
    statusCode: tabKeyToStatusCode[activeTab],
  });
  const waybillList = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const router = useRouter();

  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(waybillList, { idKey: "packingPackageCode" });
  const { mutateAsync: batchPay, isPending: isBatchPaying } = useBatchPay();
  const { mutateAsync: previewCancel, isPending: isUpdatingRoute } =
    usePreviewCancel();
  const { mutateAsync: withdrawCancel, isPending: isWithdrawCancelling } =
    useWithdrawCancel();
  const { mutateAsync: cancelWaybill, isPending: isCancelling } =
    useCancelWaybill();
  const { mutateAsync: previewChangeLine, isPending: isPreviewChangingLine } =
    usePreviewChangeLine();
  const { mutateAsync: changeLine, isPending: isChangingLine } =
    useChangeLine();
  const { mutateAsync: trackDetail, isPending: isTracking } = useTrackDetail();
  const { mutateAsync: receipt, isPending: isReceipting } = useReceipt();
  const { confirm } = useConfirm();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWaybill, setCurrentWaybill] = useState<any>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // 打开取消弹窗
  const onCancel = async (waybill: any) => {
    const res = await previewCancel(waybill?.id);

    setCurrentWaybill({ ...waybill, cancelPre: res });
    setModalType("cancel");
  };
  const handleCancel = async (waybillId: string) => {
    try {
      const bizCode = await cancelWaybill(waybillId);

      if (bizCode) router.push("/payment/" + bizCode);
    } catch {
    } finally {
      setModalType(null);
    }
  };
  // 打开更换路线弹窗
  const onChangeLine = async (waybill: any) => {
    const res = await previewChangeLine(waybill.id);

    setSelectedRouteId(
      res.find((i: any) => i.id == waybill?.shipping?.templateId)?.id || null,
    );
    setCurrentWaybill({ ...waybill, changePre: res });
    setModalType("changeLine");
  };
  // 提交跟换路线
  const handleChangeLine = async (
    waybillId: string,
    routeId: string | null,
  ) => {
    await changeLine({
      id: waybillId,
      templateId: routeId,
    });
    setModalType(null);
  };

  // 打开撤销退款弹窗
  const onRevoke = (waybillId: string) => {
    confirm({
      title: t("withdrawTitle"),
      content: t("withdrawContent"),
      onConfirm: async () => {
        await withdrawCancel(waybillId);
        setModalType(null);
      },
    });
  };
  // 打开收货弹窗
  const onReceipt = (packageId: string) => {
    confirm({
      title: t("receiptTitle"),
      content: t("receiptContent"),
      onConfirm: async () => {
        await receipt(packageId);
        setModalType(null);
      },
    });
  };

  // 批量支付 / 单个支付
  const handleBatchPay = async (packageSet: string[] = []) => {
    const bizCode = await batchPay({ packageSet });

    if (bizCode) router.push(`/payment/${bizCode}`);
  };
  // 打开路线详情弹窗
  const onTrack = async (pack: any) => {
    const res = await trackDetail({
      serverCode: pack?.shipping?.serverCode,
      shippingCode: pack?.shipping?.shippingCode,
    });

    setCurrentWaybill({ ...pack, trackDetail: res });
    setModalType("line");
  };
  const renderPackageContent = () => {
    if (!waybillList?.length && !isFetching) return <EmptyState />;

    return (
      <>
        {isFetching && <BlockSpinner />}
        <div className="space-y-2">
          {waybillList.map((p: any) => (
            <PackageItem
              key={p.packingPackageCode}
              isSelected={isSelected}
              pack={p}
              showCheckbox={activeTab == "pay"}
              onCancel={onCancel} //取消包裹预览
              onChangeLine={onChangeLine} //变更路线预览
              onPay={handleBatchPay} //支付
              onReceipt={onReceipt} //收货
              onRevoke={onRevoke} //撤回取消包裹
              onSelect={onSelect}
              onTrack={onTrack} // 路线详情
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
      content: renderPackageContent(),
    },
    {
      key: "pay",
      title: t("tabs.pay"),
      content: renderPackageContent(),
    },
    {
      key: "shipping",
      title: t("tabs.shipping"),
      content: renderPackageContent(),
    },
    {
      key: "receivde",
      title: t("tabs.received"),
      content: renderPackageContent(),
    },
  ];

  return (
    <>
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key: any) => setActiveTab(String(key))}
      />
      {activeTab == "pay" && waybillList.length > 0 && (
        <BottomAction
          buttonText={t("submitPay")}
          isAllSelected={isAllSelected}
          isLoading={isBatchPaying}
          selectedCount={selectedIds.length}
          onPress={() => handleBatchPay(selectedIds)}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
      <CancelModal
        currentWaybill={currentWaybill}
        isCancelling={isCancelling}
        isChangingLine={isPreviewChangingLine}
        isOpen={modalType === "cancel"}
        onChangeLine={onChangeLine}
        onClose={() => setModalType(null)}
        onConfirm={handleCancel}
      />
      <ChangeLineModal
        currentWaybill={currentWaybill}
        isOpen={modalType === "changeLine"}
        selectedRouteId={selectedRouteId}
        setSelectedRouteId={setSelectedRouteId}
        onClose={() => setModalType(null)}
        onConfirm={handleChangeLine}
      />

      <LineDetailModal
        currentWaybill={currentWaybill}
        isOpen={modalType === "line"}
        onClose={() => setModalType(null)}
      />
    </>
  );
}
