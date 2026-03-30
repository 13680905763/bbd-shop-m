import React, { useState } from "react";
import { Button, Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import { BlockSpinner, EmptyState } from "../ui";

import PaginationBar from "./pagination-bar";

import { useChatOrderList, useWaybillOrderList } from "@/hook/api";
import { CommonDrawer } from "@/components/drawer";
import { useGlobalStore } from "@/store";

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendWaybill: (order: any) => void;
}

export default function WaybillListModal({
  isOpen,
  onClose,
  onSendWaybill,
}: OrderListModalProps) {
  const t = useTranslations("components.chatbox");
  const { currency } = useGlobalStore();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching } = useWaybillOrderList({
    current: page,
    size: pageSize,
  });

  const orders = data?.records || [];

  return (
    <CommonDrawer
      confirmText={t("close")}
      isOpen={isOpen}
      title={t("selectWaybill")}
      onConfirm={onClose}
      onOpenChange={(open) => !open && onClose()}
    >
      <div className="flex flex-col gap-4">
        {isFetching && <BlockSpinner />}
        {!isFetching && orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {orders.map((waybill: any) => (
                <div key={waybill.packingPackageCode} className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-center ">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {t("waybillNo")}
                        {waybill.packingPackageCode}
                      </span>
                      {/* {waybill.shippingCode && (
                        <span className="text-xs text-gray-500">
                          {t("trackingNo")}
                          {waybill.shippingCode}
                        </span>
                      )} */}
                    </div>
                    <Button size="sm" color="primary" onPress={() => onSendWaybill(waybill)}>
                      {t("send")}
                    </Button>
                  </div>

                  {waybill.pic && waybill.pic.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar flex-wrap">
                      {waybill.pic.map((url: string, index: number) => (
                        <Image
                          key={index}
                          src={url}
                          referrerPolicy="no-referrer"
                          alt="waybill pic"
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <div>{t("weight")}: {waybill.weight}g</div>
                    <div>{t("size")}: {waybill.length}*{waybill.width}*{waybill.height}cm</div>
                  </div>
                </div>
              ))}
            </div>

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
