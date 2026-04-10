import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

import { BlockSpinner, EmptyState } from "../ui";

import PaginationBar from "./pagination-bar";

import { useChatOrderList } from "@/hook/business/useChat";
import { CommonDrawer } from "@/components/drawer";
import { useGlobalStore } from "@/store";

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOrder: (order: any) => void;
}

export default function OrderListModal({
  isOpen,
  onClose,
  onSendOrder,
}: OrderListModalProps) {
  const t = useTranslations("components.chatbox");
  const { currency } = useGlobalStore();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching } = useChatOrderList({
    current: page,
    size: pageSize,
  });

  const orders = data?.records || [];

  return (
    <CommonDrawer
      confirmText={t("close")}
      isOpen={isOpen}
      title={t("selectOrder")}
      onConfirm={onClose}
      onOpenChange={(open) => !open && onClose()}
    >
      <div className="flex flex-col gap-4">
        {isFetching && <BlockSpinner />}
        {!isFetching && orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order: any) => (
              <div
                key={order.orderCode}
                className="flex flex-col gap-2 rounded-lg border p-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-semibold">
                    {t("orderNo")}
                    {order.orderCode}
                  </span>
                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => onSendOrder(order)}
                  >
                    {t("send")}
                  </Button>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {order.products?.map((product: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        alt="product"
                        className="h-16 w-16 rounded object-cover"
                        referrerPolicy="no-referrer"
                        src={product.skuPicUrl || product.picUrl}
                      />
                      <div className="flex-1 text-sm">
                        <div className="line-clamp-2">
                          {product.productTitle}
                        </div>
                        <div className="mt-1 text-gray-500">
                          {t("price")}
                          {currency.symbol}
                          {product.price} x {product.purchaseQuantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {orders.length > 0 && (
              <div className="mt-4 flex w-full justify-end">
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={(data?.total as number) || 0}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
