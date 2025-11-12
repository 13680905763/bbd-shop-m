"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import { useOrderList } from "@/hook";
import ConfirmModal from "@/components/confirm-modal";
import { batchPayOrder, OrderRefund, putOrderCancel } from "@/services";
import { queryClient } from "@/lib/react-query";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function Settingpage() {
  const t = useTranslations("Profile.OrderPage"); // ✅ 命名空间

  // 传入订单状态，例如 "ALL"、"WAIT_PAY"
  const [activeTab, setActiveTab] = useState("all");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useOrderList(tabKeyToStatusCode[activeTab]);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<
    string | null
  >(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const [pendingRequestRefundId, setPendingRequestRefundId] = useState<
    string | null
  >(null);
  const router = useRouter();
  const onCancelOrder = async (orderId: string): Promise<void> => {
    try {
      // 如果只是想延迟 2 秒再发请求，可以这样写
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 调用取消接口
      await putOrderCancel({ id: orderId });

      // 刷新列表数据
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    } catch (err) {
      console.error("取消订单失败:", err);
    }
  };
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };
  const orders = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const allIds = useMemo<string[]>(() => {
    return orders.map((o: any) => o.orderCode) || [];
  }, [data]);
  // 是否全选
  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 && allIds.every((orderCode) => selected[orderCode])
    );
  }, [allIds, selected]);

  // 切换全选
  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(allIds.map((id) => [id, checked]));

    setSelected(newSelected);
  };
  // 选中的 orderCode
  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  // 提交
  const handleOrderSubmit = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsSubmitting(true); // ✅ 开始loading
      console.log("selectedIds", selectedIds);

      const bizCode = await batchPayOrder({
        orderCodeSet: selectedIds,
      });

      console.log("bizCode", bizCode);

      router.push(`/order/pay-order/${bizCode}`);
    } catch (error) {
      console.error("批量支付失败:", error);
    } finally {
      setIsSubmitting(false); // ✅ 恢复
    }
  };
  const onRequestRefund = async (orderId: string): Promise<void> => {
    try {
      await OrderRefund({ orderId: orderId });
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    } catch {}
  };

  // 初始化选中状态
  useEffect(() => {
    if (data?.pages) {
      const initialSelected: Record<string, boolean> = data.pages.reduce(
        (acc: any, item: any) => {
          acc[item.orderCode] = false;

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
        代购订单
      </NavBar>
      {/* <div className="bg-white px-2">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100 ",
            input: "text-sm",
          }}
          endContent={
            <Button
              isIconOnly
              color="primary"
              size="sm"
              type="submit"
              variant="light"
            >
              搜索
            </Button>
          }
          labelPlacement="outside"
          name="url"
          placeholder="Search..."
          startContent={
            <SearchIcon className="pointer-events-none flex-shrink-0 text-base text-default-400" />
          }
          type="search"
        />
      </div> */}
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
          {orders?.map((order: any) => (
            <OrderItem
              key={order.id}
              activeTab={activeTab}
              order={order}
              selected={!!selected[order.orderCode]}
              texts={t.raw("texts")}
              onCancelOrder={() => setPendingCancelOrderId(order.id)}
              onChange={(e: any) => {
                setSelected((prev) => ({
                  ...prev,
                  [order.orderCode]: e.target.checked,
                }));
              }}
              onPayOrderRedirect={onPayOrderRedirect}
              onRequestRefund={() => setPendingRequestRefundId(order.id)}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
          />
        </Tab>

        <Tab key="waitPay" title={t("tabs.waitPay")}>
          <>
            {/* 订单列表 */}
            <div className="flex flex-col gap-3">
              {orders.map((order: any) => (
                <OrderItem
                  key={order.id}
                  activeTab={activeTab}
                  order={order}
                  selected={!!selected[order.orderCode]}
                  texts={t.raw("texts")}
                  onCancelOrder={() => setPendingCancelOrderId(order.id)}
                  onChange={(e: any) => {
                    setSelected((prev) => ({
                      ...prev,
                      [order.orderCode]: e.target.checked,
                    }));
                  }}
                  onPayOrderRedirect={onPayOrderRedirect}
                  onRequestRefund={() => setPendingRequestRefundId(order.id)}
                />
              ))}
            </div>

            {/* 分页加载 */}
            <InfiniteScroll
              hasMore={!!hasNextPage}
              loadMore={() => fetchNextPage().then(() => undefined)}
            />
          </>
        </Tab>

        <Tab key="paid" title={t("tabs.paid")}>
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              order={order}
              texts={t.raw("texts")}
              onPayOrderRedirect={onPayOrderRedirect}
              onRequestRefund={() => setPendingRequestRefundId(order.id)}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={() => fetchNextPage().then(() => undefined)}
          />
        </Tab>
      </Tabs>

      {activeTab == "waitPay" && (
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
                onPress={handleOrderSubmit}
              >
                {t("batchPay")}
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        content={t("cancelOrderConfirm")}
        isOpen={!!pendingCancelOrderId}
        title={t("cancelOrder")}
        onConfirm={async () => {
          if (!pendingCancelOrderId) return;
          await onCancelOrder(pendingCancelOrderId);
          setPendingCancelOrderId(null);
        }}
        onOpenChange={() => setPendingCancelOrderId(null)}
      />
      <ConfirmModal
        content={t("requestRefundConfirm")}
        isOpen={!!pendingRequestRefundId}
        title={t("requestRefund")}
        onConfirm={async () => {
          if (!pendingRequestRefundId) return;
          await onRequestRefund(pendingRequestRefundId);
          setPendingRequestRefundId(null);
        }}
        onOpenChange={() => setPendingRequestRefundId(null)}
      />
    </div>
  );
}
