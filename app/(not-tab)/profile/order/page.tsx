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
  Textarea,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import { useOrderList } from "@/hook";
import ConfirmModal from "@/components/confirm-modal";
import {
  batchPayOrder,
  OrderRefund,
  putOrderCancel,
  putOrderRevoke,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function Settingpage() {
  const t = useTranslations("profile.order"); // ✅ 命名空间
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

  const { currency } = useGlobalStore();

  // === 新增两个 state 分开控制 ===
  const [cancelConfig, setCancelConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [refundConfig, setRefundConfig] = useState<{
    order: any;
  } | null>(null);
  const [revokeConfig, setRevokeConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
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
  const onRevokeOrder = async (refundId: string): Promise<void> => {
    await putOrderRevoke(refundId);
    queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/payment/${bizCode}`);
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
  const toggleOrder = (orderCode: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [orderCode]: checked }));
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

      router.push(`/payment/${bizCode}`);
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
        remark: p?.remark || "",
      }));

    if (selectedProducts.length === 0) {
      addToast({
        title: "Please select the item to be refunded",
        timeout: 1000,
        color: "danger",
      });

      return;
    }

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
  const handleRemarkChange = (index: number, value: string) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, remark: value } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };

  const EmptyOrder = () => (
    <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
      <p className="mb-2 text-lg">{t("noOrders")}</p>
    </div>
  );

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
              revokeRefund={(refundId: any) => {
                setRevokeConfig({
                  title: t("withdrawTitle"),
                  content: t("withdrawContent"),
                  onConfirm: async () => {
                    await onRevokeOrder(refundId);
                  },
                });
              }}
              selected={!!selected[order.orderCode]}
              onCancelOrder={() =>
                setCancelConfig({
                  title: t("cancelTitle"),
                  content: t("cancelContent"),
                  onConfirm: async () => {
                    await onCancelOrder(order.id);
                  },
                })
              }
              onChange={(e: any) =>
                toggleOrder(order.orderCode, e.target.checked)
              }
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
          {isLoading ? (
            <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
              <div className="mb-2 text-lg">
                <Spinner />
              </div>
            </div>
          ) : (
            <OrderTabContent orders={orders || []} />
          )}
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
      {revokeConfig && (
        <ConfirmModal
          content={revokeConfig.content}
          isOpen={!!revokeConfig}
          title={revokeConfig.title}
          onConfirm={async () => {
            await revokeConfig.onConfirm();
            setRevokeConfig(null);
          }}
          onOpenChange={() => setRevokeConfig(null)}
        />
      )}
      {refundConfig && (
        <CommonModal
          isOpen={!!refundConfig}
          title={t("refundTitle")}
          onConfirm={handleRefundSubmit}
          onOpenChange={() => setRefundConfig(null)}
        >
          <div className="space-y-3">
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
                  <CardBody className="flex flex-col gap-3 p-4">
                    {/* 商品项 */}
                    <div className="flex gap-3">
                      <Checkbox
                        className="mt-1"
                        isDisabled={
                          product.isRefunded || product.canRefundQty === 0
                        }
                        isSelected={product.selected || false}
                        size="sm"
                        onValueChange={(checked) =>
                          handleSelect(index, checked)
                        }
                      />
                      {/* 左侧：选择框 + 商品图 */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-[70px] w-[70px] flex-shrink-0">
                          <Image
                            alt={product.productTitle}
                            className="h-full w-full rounded-md object-cover"
                            height={70}
                            referrerPolicy="no-referrer"
                            src={
                              product.skuPicUrl ||
                              product.picUrl ||
                              "/placeholder.png"
                            }
                            width={70}
                          />
                        </div>
                      </div>

                      {/* 右侧内容块 */}
                      <div className="flex flex-1 flex-col justify-between">
                        {/* 上 - 标题 + 规格 + 价格 */}
                        <div className="flex items-start justify-between">
                          {/* 标题 & 规格 */}
                          <div className="flex min-w-0 flex-col">
                            <span className="line-clamp-2 text-sm font-medium text-gray-900">
                              {product.productTitle}
                            </span>

                            <span className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                              {product?.propAndValue?.propName_valueName || "-"}
                            </span>

                            {product.canRefundQty === 0 && (
                              <span className="mt-0.5 text-xs text-red-400">
                                {t("unrefundable")}
                              </span>
                            )}
                          </div>

                          {/* 右边价格 */}
                          <div className="ml-3 flex-shrink-0 text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              {currency.symbol}
                              {product.price}
                            </span>
                            <div className="text-xs text-gray-500">
                              x{product.purchaseQuantity}
                            </div>
                          </div>
                        </div>

                        {/* 下 - 输入框 + 可退数量 */}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <input
                        className="w-16 rounded border px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
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

                      <span className="text-xs text-gray-400">
                        {t("refundable")} {product.canRefundQty}
                      </span>
                    </div>
                    {/* 第二行：备注输入框 */}
                    <div className="">
                      <Textarea
                        classNames={{
                          inputWrapper:
                            "bg-white border border-gray-300 rounded-md shadow-none " +
                            "focus-within:bg-white focus-within:border-primary " +
                            "focus-within:ring-1 focus-within:ring-primary transition-colors",
                          input:
                            "text-sm text-gray-800 placeholder:text-gray-400",
                        }}
                        minRows={2}
                        placeholder={t("remarkPlaceholder")}
                        value={product.remark || ""}
                        onChange={(e) =>
                          handleRemarkChange(index, e.target.value)
                        }
                      />
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
