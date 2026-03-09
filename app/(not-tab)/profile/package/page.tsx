"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import SelectionLineDrawer from "../../submit/warehouse/selection-line-drawer";

import PackageItem from "./package-item";
import CancelModal from "./cancel-modal";
import LineDetailDrawer from "./line-detail-drawer";
import MoreActions, { MoreActionType } from "./more-actions";
import ChangeAddressModal from "./change-address-modal";

import { useSelection, useConfirm } from "@/hook/common";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { BottomAction, CommonTabs } from "@/components/common";
import {
  useBatchPay,
  useCancelWaybill,
  useChangeAddress,
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

type ModalType =
  | "cancel"
  | "revoke"
  | "changeLine"
  | "line"
  | "receipt"
  | "edit"
  | "changeAddress"
  | "moreActions"
  | null;

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
  const { mutateAsync: changeAddress, isPending: isChangingAddress } =
    useChangeAddress();
  const { confirm } = useConfirm();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWaybill, setCurrentWaybill] = useState<any>(null);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

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

  // 统一处理 MoreActions
  const handleMoreActions = async (waybill: any, type: MoreActionType) => {
    if (type === "changeLine") {
      console.log("waybill", waybill);
      const res = await previewChangeLine(waybill.id);

      setSelectedLineId(waybill?.shipping?.templateId);
      setCurrentWaybill({ ...waybill, previewChangeLine: res });
      setModalType("changeLine");
    } else if (type === "changeAddress") {
      setModalType("moreActions");
    }
  };
  // 提交跟换路线
  const handleChangeLine = async (lineId: string | null) => {
    await changeLine({
      id: currentWaybill?.id,
      templateId: lineId,
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
  // 打开编辑弹窗（选择 修改路线 或 修改地址）
  const onEdit = (waybill: any) => {
    setCurrentWaybill(waybill);
    setModalType("edit");
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
  // 提交修改地址
  const handleChangeAddress = async (data: {
    customerAddressId: string;
    routeId?: string;
    remark?: string;
  }) => {
    if (!currentWaybill) return;

    return await changeAddress({
      id: currentWaybill.id,
      customerAddressId: data.customerAddressId,
      templateId: data.routeId, // 假设后端接口接收 templateId 作为路线ID
      remark: data.remark,
    });
  };

  // 批量支付 / 单个支付
  const handlePay = async (packageSet: string[] = []) => {
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
              onEdit={onEdit} // 编辑包裹
              onPay={handlePay} //支付
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
          onPress={() => handlePay(selectedIds)}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}

      <CancelModal
        currentWaybill={currentWaybill}
        isOpen={modalType === "cancel"}
        onClose={() => setModalType(null)}
        onConfirm={handleCancel}
      />

      <MoreActions
        currentWaybill={currentWaybill}
        isOpen={modalType === "edit"}
        onAction={handleMoreActions}
        onClose={() => setModalType(null)}
      />
      <ChangeAddressModal
        currentWaybill={currentWaybill}
        isOpen={modalType === "moreActions"}
        onConfirm={handleChangeAddress}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
      <SelectionLineDrawer
        isOpen={modalType === "changeLine"}
        lines={
          Array.isArray(currentWaybill?.previewChangeLine)
            ? currentWaybill?.previewChangeLine
            : []
        }
        selectedLineId={selectedLineId}
        onConfirm={handleChangeLine}
        onOpenChange={() => setModalType(null)}
      />

      <LineDetailDrawer
        currentWaybill={currentWaybill}
        isOpen={modalType === "line"}
        onClose={() => setModalType(null)}
      />
    </>
  );
}
