"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";
import OrderRefundItem from "./order-refund-item";

import { useOrderList } from "@/hook";
import { useEnhancedSelection, useSelection } from "@/hook/common";
import { useOrderRefundList } from "@/hook/order/useOrderRefundList";
import OrderPromptCard from "@/components/order/order-prompt-card";
import { useConfirm } from "@/components/common";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";
import { useBatchPayOrder, useCancelOrder, useRefundOrder, useRevokeOrder } from "@/hook/api";
import RefundModal from "./refund-modal";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};


type OrderModalState =
  | { type: "cancel"; orderId: string }
  | { type: "revoke"; refundId: string }
  | { type: "refund"; order: any }
  | null;

export default function Settingpage() {
  const t = useTranslations("profile.order"); // ✅ 命名空间
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("all");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    isFetching,
    isFetchingNextPage,
  } = useOrderList(tabKeyToStatusCode[activeTab]);
  const {
    data: dataR,
    fetchNextPage: fetchNextPageR,
    hasNextPage: hasNextPageR,
    isLoading: isLoadingR,
    isFetching: isFetchingR,
    isFetchingNextPage: isFetchingNextPageR,
  } = useOrderRefundList();

  const [modal, setModal] = useState<OrderModalState>(null);


  const orders = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const orderRefunds = dataR?.pages?.flatMap((page: any) => page.records) ?? [];


  const { confirm } = useConfirm();
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const { mutateAsync: batchPayOrder, isPending: isBatchPay } = useBatchPayOrder();
  const { mutateAsync: refundOrder, } = useRefundOrder();
  const { mutateAsync: revokeOrder, } = useRevokeOrder();

  const {
    selectedIds,
    isSelected,
    hasSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(orders, { idKey: "orderCode" });
  const {
    items,
    toggleSelection,
    updateQuantity, // 更新数量
    updateRemark, // 更新备注
    getSelectedItems, // 获取选中结果
  } = useEnhancedSelection(modal?.type === "refund" ? modal?.order?.products || [] : []);
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
    setModal({
      type: "refund",
      order: { ...order },
    })
  };
  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (modal?.type !== "refund") return;
    const param = {
      orderId: modal.order.id,
      skuList: getSelectedItems().map((p: any) =>
      ({
        sourceProductId: p?.sourceProductId,
        sourceSkuId: p?.sourceSkuId,
        quantity: p.quantity,
        remark: p.remark || "",
      })
      ),
    }
    console.log('params', param);
    await refundOrder(param);
    setModal(null);
  };
  // 批量支付
  const handleBatchPay = async () => {
    const bizCode = await batchPayOrder({
      orderCodeSet: selectedIds,
    });
    router.push(`/payment/${bizCode}`);
  };

  const OrderRefundTabContent = ({ orders }: { orders: any[] }) => {
    if (isLoadingR)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!orders?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-lg text-gray-500">
          {t("noOrders")}
        </div>
      );

    return (
      <>
        {isFetchingR && !isFetchingNextPageR && (
          <Spinner className="mb-2 flex justify-center text-gray-500" />
        )}
        <div className="flex flex-col gap-3">
          {orders.map((o: any) => (
            <OrderRefundItem key={o.id} activeTab={activeTab} order={o} />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPageR}
          loadMore={(isRetry) => fetchNextPageR().then(() => undefined)}
        >
          {!hasNextPageR && (
            <div className="text-center text-[#999]">{t("noMoreRecords")}</div>
          )}
          {isFetchingNextPageR && <Spinner />}
        </InfiniteScroll>
      </>
    );
  };
  const renderOrderContent = () => {
    if (!orders?.length && !isFetching) return <EmptyState />;
    return (
      <>
        {(isFetching || isLoading) && <BlockSpinner />}
        <div className="space-y-2 scrollbar-hide min-h-[60vh]">
          {
            orders.map((order: any) => (
              <OrderItem
                key={order.id}
                showCheckbox={activeTab === "waitPay"}
                order={order}
                isSelected={isSelected}
                onChange={onSelect}
                onCancel={onCancel} //取消订单
                onRefund={handleRefund}
                onPayOrderRedirect={(bizCode: string) => {
                  router.push(`/payment/${bizCode}`);
                }}
                onRevoke={onRevoke} //撤销退款订单
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
        </InfiniteScroll>


      </>
    );
  };

  return (
    <>
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <Tabs
        aria-label="Options"
        classNames={{
          base: " w-full bg-white p-1 flex-1 max-h-[48px]",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
          tab: " px-0 h-12 flex-1 ",
          cursor: "h-0",
          tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
          panel: "bg-[#f7f8f9] px-2 flex-1 overflow-auto scrollbar-hide ",
        }}
        variant="underlined"
        onSelectionChange={(key) => {
          if (key != "refund") {
            setActiveTab(String(key));
          } else {
          }
        }}
      // onSelectionChange={(key) => setActiveTab(String(key))}
      >
        <Tab key="all" className="" title={t("tabs.all")}>
          <OrderPromptCard />
          {renderOrderContent()}
        </Tab>
        <Tab key="waitPay" title={t("tabs.waitPay")}>
          <OrderPromptCard />
          {renderOrderContent()}
        </Tab>
        <Tab key="paid" title={t("tabs.paid")}>
          <OrderPromptCard />
          {renderOrderContent()}
        </Tab>
        <Tab key="refund" title={t("tabs.refund")}>
          <OrderRefundTabContent orders={orderRefunds} />
        </Tab>
      </Tabs>
      {activeTab == "waitPay" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isBatchPay}
                onPress={handleBatchPay}
              >
                {t("buttons.batchPay")}
              </Button>
            </div>
          </div>
        </div>
      )}
      {modal?.type === "refund" && (
        <RefundModal
          products={items}
          onCancel={() => setModal(null)}
          onRemarkChange={updateRemark}
          onSelect={toggleSelection}
          onSubmit={handleRefundSubmit}
          onUpdateQuantity={updateQuantity}
          isDisabled={getSelectedItems().length === 0}
        />
      )}
    </>
  );
}
