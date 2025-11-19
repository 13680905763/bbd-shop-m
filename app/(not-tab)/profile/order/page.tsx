"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
  Image,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import { useOrderList } from "@/hook";
import ConfirmModal from "@/components/confirm-modal";
import { batchPayOrder, OrderRefund, putOrderCancel } from "@/services";
import { queryClient } from "@/lib/react-query";
import CommonModal from "@/components/modal/common-modal";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function Settingpage() {
  const t = useTranslations("profile.orderPage"); // ✅ 命名空间
  // 传入订单状态，例如 "ALL"、"WAIT_PAY"
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

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const [pendingRequestRefundId, setPendingRequestRefundId] = useState<
    string | null
  >(null);

  // === 新增两个 state 分开控制 ===
  const [cancelConfig, setCancelConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [refundConfig, setRefundConfig] = useState<{
    order: any;
  } | null>(null);

  const router = useRouter();
  const onCancelOrder = async (orderId: string): Promise<void> => {
    try {
      // 调用取消接口
      await putOrderCancel({ id: orderId });

      // 刷新列表数据
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    } catch {}
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

      const bizCode = await batchPayOrder({
        orderCodeSet: selectedIds,
      });

      router.push(`/order/pay-order/${bizCode}`);
    } catch {
    } finally {
      setIsSubmitting(false); // ✅ 恢复
    }
  };
  const onRequestRefund = async (order: any): Promise<void> => {
    const productsWithRefund = order.products.map((p: any) => ({
      ...p,
      selected: true, // 默认不勾选
      refundQuantity: p.canRefundQty, // 默认退款数量为原订单数量
    }));

    setRefundConfig({
      order: {
        ...order,
        products: productsWithRefund,
      },
    });
    // await OrderRefund({ orderId });
    // queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };
  // const onRequestRefund = async (orderId: string): Promise<void> => {
  //   try {
  //     await OrderRefund({ orderId: orderId });
  //     queryClient.invalidateQueries({ queryKey: ["orderList"] });
  //   } catch {}
  // };

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

  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (!refundConfig) return;

    // 只提交被勾选的商品
    const selectedProducts = refundConfig.order.products
      .filter((p: any) => p.selected)
      .map((p: any) => ({
        sourceProductId: p.sourceProductId,
        sourceSkuId: p.sourceSkuId,
        quantity: p.refundQuantity,
      }));

    if (selectedProducts.length === 0) {
      alert("请选择要退款的商品");

      return;
    }
    console.log("555", {
      orderId: refundConfig.order.id,
      skuList: selectedProducts,
    });

    await OrderRefund({
      orderId: refundConfig.order.id,
      skuList: selectedProducts,
    });

    queryClient.invalidateQueries({ queryKey: ["orderList"] });
    setRefundConfig(null);
  };

  const handleSelect = (index: number, checked: boolean) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, selected: checked } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };

  const handleQtyChange = (index: number, value: number) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, refundQuantity: value } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };
  const EmptyOrder = () => (
    <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
      <p className="mb-2 text-lg">{t("noOrders") || "空"}</p>
    </div>
  );

  console.log("isLoading", isLoading);
  console.log("hasNextPage", hasNextPage);
  console.log("isFetchingNextPage", isFetchingNextPage);

  const OrderTabContent = ({
    orders,
  }: {
    orders: any[];
    footer?: React.ReactNode;
  }) => {
    if (!orders?.length) return <EmptyOrder />;

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
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              activeTab={activeTab}
              order={order}
              selected={!!selected[order.orderCode]}
              texts={t.raw("texts")}
              onCancelOrder={() =>
                setCancelConfig({
                  title: t("cancelTitle") || "123",
                  content: t("cancelContent") || "123",
                  onConfirm: async () => {
                    await onCancelOrder(order.id);
                  },
                })
              }
              // onChange={(e: any) =>
              //   toggleOrder(order.orderCode, e.target.checked)
              // }
              onPayOrderRedirect={onPayOrderRedirect}
              onRequestRefund={() => {
                onRequestRefund(order);
              }}
            />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="mb-2 text-lg">
              <Spinner />
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
      <NavBar className="flex-[0_0_45px] bg-white" onBack={() => router.back()}>
        代购订单
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
          {isLoading ? (
            <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
              <div className="mb-2 text-lg">
                <Spinner />
              </div>
            </div>
          ) : (
            <OrderTabContent orders={orders || []} />
          )}

          {/* {orders?.map((order: any) => (
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
          ))} */}
        </Tab>

        <Tab key="waitPay" title={t("tabs.waitPay")}>
          <>
            {isLoading ? (
              <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
                <div className="mb-2 text-lg">
                  <Spinner />
                </div>
              </div>
            ) : (
              <OrderTabContent orders={orders || []} />
            )}
            {/* <div className="flex flex-col gap-3">
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

            <InfiniteScroll
              hasMore={!!hasNextPage}
              loadMore={() => fetchNextPage().then(() => undefined)}
            /> */}
          </>
        </Tab>

        <Tab key="paid" title={t("tabs.paid")}>
          {isLoading ? (
            <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
              <div className="mb-2 text-lg">
                <Spinner />
              </div>
            </div>
          ) : (
            <OrderTabContent orders={orders || []} />
          )}
          {/* {orders.map((order: any) => (
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
          /> */}
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
      {cancelConfig && (
        <ConfirmModal
          content={cancelConfig.content}
          isOpen={!!cancelConfig}
          title={cancelConfig.title}
          onConfirm={async () => {
            await cancelConfig.onConfirm();
            setCancelConfig(null);
            queryClient.invalidateQueries({
              queryKey: ["orderList", activeTab],
            });
          }}
          onOpenChange={() => setCancelConfig(null)}
        />
      )}
      {refundConfig && (
        <CommonModal
          isOpen={!!refundConfig}
          title={t("requestRefund")}
          onConfirm={handleRefundSubmit}
          onOpenChange={() => setRefundConfig(null)}
        >
          <div className="space-y-2">
            {refundConfig?.order?.products.map(
              (product: any, index: number) => (
                <Card
                  key={index}
                  className={`rounded-lg border shadow-sm transition-all duration-150 ${
                    product.selected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white"
                  }`}
                  isPressable={false}
                >
                  <CardBody>
                    <div className="flex items-center justify-between gap-2 p-2">
                      {/* 左侧：选择框 + 商品信息 */}
                      <div className="flex min-w-0 items-center gap-2">
                        <Checkbox
                          isDisabled={
                            product.isRefunded || product.canRefundQty === 0
                          }
                          isSelected={product.selected || false}
                          size="sm"
                          onValueChange={(checked) =>
                            handleSelect(index, checked)
                          }
                        />

                        <div className="h-12 w-12 flex-shrink-0">
                          <Image
                            alt={product.productTitle}
                            className="h-full w-full rounded-md object-cover"
                            height={48}
                            src={
                              product.skuPicUrl ||
                              product.picUrl ||
                              "/placeholder.png"
                            }
                            width={48}
                          />
                        </div>

                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-gray-900">
                            {product.productTitle}
                          </span>
                          <span className="truncate text-xs text-gray-500">
                            {product?.sku?.propName_valueName || "-"}
                          </span>
                        </div>
                      </div>

                      {/* 右侧：价格 + 数量输入 */}
                      <div className="flex min-w-[70px] flex-shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          ¥{product.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          x{product.quantity}
                        </span>

                        <input
                          className="w-14 rounded border px-2 py-1 text-center text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                          disabled={
                            !product.selected ||
                            product.isRefunded ||
                            product.canRefundQty === 0
                          }
                          max={product.canRefundQty}
                          min={1}
                          type="number"
                          value={product.refundQuantity}
                          onChange={(e) =>
                            handleQtyChange(index, Number(e.target.value))
                          }
                        />

                        <span className="text-[10px] text-gray-400">
                          可退 {product.canRefundQty}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ),
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
