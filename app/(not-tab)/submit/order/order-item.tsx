"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import React from "react";

import SourceIcon from "@/components/common/source-icon";
import { useGlobalStore } from "@/store";
import { ProductItem } from "@/components/common";

export default function OrderItem({
  order,
  openServiceModal,
  isExpired = false,
}: any) {
  const t = useTranslations("submit.order");

  const { currency } = useGlobalStore();

  return (
    <div className="space-y-2 rounded-lg bg-white px-2 py-3">
      <div className="flex items-center gap-2">
        <SourceIcon source={order?.source} />
        <div className="text-title">{order?.shopName}</div>
      </div>
      {order.products.map((product: any) => (
        <React.Fragment key={product?.propAndValue?.propId_valueId}>
          <ProductItem isDisabled={isExpired} product={product} />
          {!isExpired && (
            <div className="rounded-lg bg-[#f8f8f8] p-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {t("valueAddedService")}
                  </span>

                  {product?.orderServiceList?.length > 0 ? (
                    product?.orderServiceList.map((item: any) => (
                      <span
                        key={item.serviceCode}
                        className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-700"
                      >
                        {item.serviceName}*{item.quantity}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      {t("noService")}
                    </span>
                  )}
                </div>

                <Button
                  className="button-white"
                  size="sm"
                  onPress={() => {
                    openServiceModal(
                      product?.cartId || 1,
                      product?.propAndValue?.propId_valueId,
                    );
                  }}
                >
                  {t("add")}
                </Button>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      {!isExpired && (
        <div className="text-right">
          <div>
            {t("shippingFee")}
            {currency.symbol}
            {order?.postFee}
          </div>
          <div>
            {t("serviceFee")}
            {currency.symbol}
            {order?.serviceFee}
          </div>
          <div>
            {t("productFee")}
            {currency.symbol}
            {order?.productFee}
          </div>
          <div className="font-bold">
            {t("shopTotal")}
            {currency.symbol}
            {order?.totalFee}
          </div>
        </div>
      )}
    </div>
  );
}
