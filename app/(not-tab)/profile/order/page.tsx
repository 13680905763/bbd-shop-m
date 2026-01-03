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
  Image,
  Textarea,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

import OrderItem from "./order-item";
import OrderRefundItem from "./order-refund-item";
import OrderPromptCard from "./component/order-prompt-card";

import { useOrderList } from "@/hook";
import ConfirmModal from "@/components/modal/confirm-modal";
import {
  batchPayOrder,
  OrderRefund,
  putOrderCancel,
  putOrderRevoke,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import { useSelection } from "@/hook/useSelection";
import { useOrderRefundList } from "@/hook/order/useOrderRefundList";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

type ModalType = "cancel" | "revoke" | "refund" | null;

interface ModalState {
  type: ModalType;
  confirm?: () => Promise<void>;
  order?: any; // 退款 modal 可能需要 order 数据
  refundProducts?: any[]; // 退款 modal 选中商品信息
}
export default function Settingpage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.order",
  });
  const { currency } = useGlobalStore();
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

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const [modal, setModal] = useState<ModalState>({ type: null });

  const orders = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const orderRefunds = dataR?.pages?.flatMap((page: any) => page.records) ?? [];

  console.log("orderRefunds", orderRefunds);

  // ================= 使用 useSelection =================
  const {
    selectedIds,
    isSelected,
    hasSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
  } = useSelection(orders, { idKey: "orderCode" });
  // 打开取消弹窗
  const openCancelModal = (orderId: string) => {
    setModal({
      type: "cancel",
      confirm: async () => {
        await putOrderCancel(orderId);
        await queryClient.invalidateQueries({ queryKey: ["orderList"] });
        setModal({ type: null });
      },
    });
  };
  // 打开撤销退款弹窗
  const openRevokeModal = (refundId: string) => {
    setModal({
      type: "revoke",
      confirm: async () => {
        await putOrderRevoke(refundId);
        await queryClient.invalidateQueries({ queryKey: ["orderList"] });
        setModal({ type: null });
      },
    });
  };
  // 打开退款弹窗
  const openRefundModal = (order: any) => {
    setModal({
      type: "refund",
      order,
      refundProducts: order.products.map((p: any) => ({
        ...p,
        selected: true,
        refundQuantity: p.canRefundQty,
      })),
    });
  };
  // 提交退款逻辑
  const handleRefundConfirm = async () => {
    if (!modal.order || !modal.refundProducts) return;

    // 这里直接使用 modal.refundProducts 的最新值
    const selectedProducts = modal.refundProducts
      .filter((p) => p.selected)
      .map((p) => ({
        sourceProductId: p.sourceProductId,
        sourceSkuId: p.sourceSkuId,
        quantity: p.refundQuantity,
        remark: p.appleRemark || "",
      }));

    console.log("selectedProducts", selectedProducts);

    if (!selectedProducts.length) {
      addToast({
        title: "Please select an item",
        color: "danger",
        timeout: 1000,
      });

      return;
    }

    await OrderRefund({
      orderId: modal.order.id,
      skuList: selectedProducts,
    });

    await queryClient.invalidateQueries({ queryKey: ["orderList"] });
    setModal({ type: null });
  };
  // 批量支付
  const handleBatchPay = async () => {
    try {
      setIsSubmitting(true); // ✅ 开始loading

      const bizCode = await batchPayOrder({
        orderCodeSet: selectedIds,
      });

      router.push(`/payment?bizCode=${bizCode}`);
    } catch {
    } finally {
      setIsSubmitting(false); // ✅ 恢复
    }
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
  const OrderTabContent = ({ orders }: { orders: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!orders?.length)
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
          {orders.map((o: any) => (
            <OrderItem
              key={o.id}
              activeTab={activeTab}
              order={o}
              selected={isSelected(o.orderCode)}
              onCancelOrder={() => openCancelModal(o.id)} //取消订单
              onChange={() => toggle(o.orderCode)}
              onPayOrderRedirect={(bizCode: string) => {
                router.push(`/payment?bizCode=${bizCode}`);
              }}
              onRefundOrder={() => openRefundModal(o)} //申请退款订单
              onRevokeRefundOrder={(refundId: string) =>
                openRevokeModal(refundId)
              } //撤销退款订单
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
    <>
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>
      <Tabs
        aria-label="Options"
        classNames={{
          base: " w-full bg-white p-1",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
          tab: " px-0 h-12 flex-1",
          cursor: "h-0",
          tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
          panel: "bg-[#f7f8f9] px-2 flex-1 overflow-auto ",
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
          <OrderTabContent orders={orders} />
        </Tab>
        <Tab key="waitPay" title={t("tabs.waitPay")}>
          <OrderPromptCard />
          <OrderTabContent orders={orders} />
        </Tab>
        <Tab key="paid" title={t("tabs.paid")}>
          <OrderPromptCard />
          <OrderTabContent orders={orders} />
        </Tab>
        <Tab key="refund" title={t("tabs.refund")}>
          <OrderRefundTabContent orders={orderRefunds} />
        </Tab>
      </Tabs>

      {activeTab == "waitPay" && (
        <div className="card-cart sticky bottom-0 z-10 bg-white p-2">
          <div className="flex items-center justify-between gap-4">
            {/* 全选 */}
            <div className="flex gap-4">
              <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
            </div>

            {/* 批量支付按钮 */}
            <div className="flex items-center gap-2">
              <Button
                className="w-[150px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isSubmitting}
                onPress={handleBatchPay}
              >
                {t("buttons.batchPay")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "cancel" && (
        <ConfirmModal
          isOpen
          content={t("cancelContent")}
          title={t("cancelTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {modal.type === "revoke" && (
        <ConfirmModal
          isOpen
          content={t("withdrawContent")}
          title={t("withdrawTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {modal.type === "refund" && (
        <CommonModal
          isOpen
          isDisabledConfirm={
            !modal?.refundProducts?.filter((p) => p.selected).length
          }
          title={t("refundTitle")}
          onConfirm={handleRefundConfirm}
          onOpenChange={() => setModal({ type: null })}
        >
          <div className="space-y-3">
            {modal.refundProducts?.map((product: any, index: number) => (
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
                  <div className="flex gap-3">
                    <Checkbox
                      className="mt-1"
                      isDisabled={
                        product.isRefunded || product.canRefundQty === 0
                      }
                      isSelected={product.selected || false}
                      size="sm"
                      onValueChange={(checked) => {
                        setModal((prev) => {
                          const newProducts = prev.refundProducts?.map(
                            (p, i) =>
                              i === index ? { ...p, selected: checked } : p,
                          );

                          return { ...prev, refundProducts: newProducts };
                        });
                      }}
                    />
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
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
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
                      onBlur={() => {
                        // 失焦时校验范围
                        setModal((prev) => {
                          const newProducts = prev.refundProducts?.map(
                            (p, i) => {
                              if (i !== index) return p;
                              let val = p.refundQuantity || 1;

                              if (val < 1) val = 1;
                              if (val > product.canRefundQty)
                                val = product.canRefundQty;

                              return { ...p, refundQuantity: val };
                            },
                          );

                          return { ...prev, refundProducts: newProducts };
                        });
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // 允许输入过程中的任意数字（包括 0 开头、空字符串）
                        setModal((prev) => {
                          const newProducts = prev.refundProducts?.map(
                            (p, i) =>
                              i === index
                                ? {
                                    ...p,
                                    refundQuantity:
                                      value === "" ? "" : Number(value),
                                  }
                                : p,
                          );

                          return { ...prev, refundProducts: newProducts };
                        });
                      }}
                    />
                    <span className="text-xs text-gray-400">
                      {t("refundable")} {product.canRefundQty}
                    </span>
                  </div>

                  <Textarea
                    classNames={{
                      inputWrapper:
                        "bg-white border border-gray-300 rounded-md shadow-none focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors",
                      input:
                        "text-base text-gray-800 placeholder:text-gray-400",
                    }}
                    minRows={2}
                    placeholder={t("remarkPlaceholder")}
                    onChange={(e) => {
                      const value = e.target.value;

                      setModal((prev) => {
                        const newProducts = prev.refundProducts?.map((p, i) =>
                          i === index ? { ...p, appleRemark: value } : p,
                        );

                        return { ...prev, refundProducts: newProducts };
                      });
                    }}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </CommonModal>
      )}
    </>
  );
}
