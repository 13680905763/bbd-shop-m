"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";
import RefundModal from "./refund-modal";
import RefundOrderItem from "./refund-order-item";
import OrderPromptCard from "./order-prompt-card";

import { useEnhancedSelection, useSelection } from "@/hook/common";
import { useConfirm, BottomAction, CommonTabs } from "@/components/common";
import { BlockSpinner, EmptyState } from "@/components/ui";
import {
  useBatchPayOrder,
  useCancelOrder,
  useRefundOrder,
  useRevokeOrder,
  useOrderList,
  useRefundOrderList,
} from "@/hook/api";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function OrderPage() {
  const t = useTranslations("profile.order"); // ✅ 命名空间
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentItem, setCurrentItem] = useState<any>(null);
  // 订单相关数据
  const { data, isFetching, fetchNextPage, hasNextPage } = useOrderList({
    size: 10,
    customerPayStatusCode: tabKeyToStatusCode[activeTab],
    statusCode: tabKeyToStatusCode[activeTab] === "201" ? "101" : "",
    enabled: activeTab !== "refund",
  });
  const orders = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(orders, { idKey: "orderCode" });

  const {
    data: dataRefund,
    fetchNextPage: fetchNextPageRefund,
    hasNextPage: hasNextPageRefund,
    isFetching: isFetchingRefund,
  } = useRefundOrderList({
    size: 10,
    enabled: activeTab === "refund",
  });
  const refundOrders =
    dataRefund?.pages?.flatMap((page: any) => page.records) ?? [];

  const { confirm } = useConfirm();
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const { mutateAsync: batchPayOrder, isPending: isBatchPay } =
    useBatchPayOrder();
  const { mutateAsync: refundOrder } = useRefundOrder();
  const { mutateAsync: revokeOrder } = useRevokeOrder();

  const {
    items,
    toggleSelection,
    updateQuantity, // 更新数量
    updateRemark, // 更新备注
    getSelectedItems, // 获取选中结果
  } = useEnhancedSelection(currentItem?.products || []);
  // 打开取消弹窗
  const onCancel = async (orderId: string) => {
    await confirm({
      title: t("cancelTitle"),
      content: t("cancelContent"),
      onConfirm: async () => {
        await cancelOrder(orderId);
      },
    });
  };
  // 打开撤销退款弹窗
  const onRevoke = async (refundId: string) => {
    await confirm({
      title: t("withdrawTitle"),
      content: t("withdrawContent"),
      onConfirm: async () => {
        await revokeOrder(refundId);
      },
    });
  };
  const handleRefund = (order: any) => {
    setCurrentItem({ ...order });
    onOpen();
  };
  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    const param = {
      orderId: currentItem.id,
      skuList: getSelectedItems().map((p: any) => ({
        sourceProductId: p?.sourceProductId,
        sourceSkuId: p?.sourceSkuId,
        quantity: p.quantity,
        remark: p.remark || "",
      })),
    };

    await refundOrder(param);
    setCurrentItem(null);
    onClose();
  };
  // 批量支付 / 单个支付
  const handleBatchPay = async (orderCodeSet: string[] = []) => {
    const bizCode = await batchPayOrder({ orderCodeSet });

    if (bizCode) router.push(`/payment/${bizCode}`);
  };
  const renderRefundOrderContent = () => {
    if (!refundOrders?.length && !isFetchingRefund) return <EmptyState />;

    return (
      <>
        {isFetchingRefund && <BlockSpinner />}
        <div className="flex flex-col gap-3">
          {refundOrders.map((o: any) => (
            <RefundOrderItem key={o.id} activeTab={activeTab} order={o} />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPageRefund}
          loadMore={(isRetry) => fetchNextPageRefund().then(() => undefined)}
        >
          {!hasNextPageRefund && <EmptyState className="!h-auto" />}
        </InfiniteScroll>
      </>
    );
  };
  const renderOrderContent = () => {
    if (!orders?.length && !isFetching) return <EmptyState />;

    return (
      <>
        {isFetching && <BlockSpinner />}
        <OrderPromptCard />
        <div className="space-y-2">
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              isSelected={isSelected}
              order={order}
              showCheckbox={activeTab === "waitPay"}
              onCancel={onCancel} //取消订单
              onChange={onSelect}
              onPay={handleBatchPay}
              onRefund={handleRefund}
              onRevoke={onRevoke} //撤销退款订单
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
      content: renderOrderContent(),
    },
    {
      key: "waitPay",
      title: t("tabs.waitPay"),
      content: renderOrderContent(),
    },
    {
      key: "paid",
      title: t("tabs.paid"),
      content: renderOrderContent(),
    },
    {
      key: "refund",
      title: t("tabs.refund"),
      content: renderRefundOrderContent(),
    },
  ];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key) => setActiveTab(String(key))}
      />
      {activeTab == "waitPay" && orders.length > 0 && (
        <BottomAction
          buttonText={t("buttons.batchPay")}
          isAllSelected={isAllSelected}
          isLoading={isBatchPay}
          selectedCount={selectedIds.length}
          onPress={() => handleBatchPay(selectedIds)}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
      {isOpen && (
        <RefundModal
          isDisabled={getSelectedItems().length === 0}
          products={items}
          onCancel={() => {
            setCurrentItem(null);
            onClose();
          }}
          onRemarkChange={updateRemark}
          onSelect={toggleSelection}
          onSubmit={handleRefundSubmit}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </>
  );
}
