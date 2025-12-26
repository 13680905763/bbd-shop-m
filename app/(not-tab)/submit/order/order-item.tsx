"use client";

import { Button, Image } from "@heroui/react";
import { useTranslation } from "react-i18next";

import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";
import { useGlobalStore } from "@/store";

export default function OrderItem({ order, openServiceModal }: any) {
  const { t } = useTranslation("translation", {
    keyPrefix: "submit.order",
  });
  const { currency } = useGlobalStore();

  return (
    <div className="rounded-box mb-3 px-2 py-3">
      {/* 店铺信息 */}
      <div className="flex items-center gap-2">
        <SourceIcon source={order?.source} />
        <div className="text-title">{order?.shopName}</div>
      </div>

      {/* 商品列表 */}
      {order.products.map((product: any) => (
        <div key={product?.propAndValue?.propName_valueName}>
          {/* 商品内容 */}
          <div className="my-3 flex gap-2">
            {/* 左侧图片 */}

            <Image
              alt="商品图"
              className="rounded-md object-cover"
              classNames={{
                wrapper: "self-start",
              }}
              height={93}
              referrerPolicy="no-referrer"
              src={product.skuPicUrl}
              width={93}
            />

            {/* 右侧信息 */}
            <div className="flex-1">
              <div className="text-title line-clamp-1 !text-base">
                {product.productTitle}
              </div>
              <div className="text-light-gray line-clamp-2">
                {product.propAndValue.propName_valueName}
              </div>
              <div className="line-clamp-1 !text-sm">
                {t("remark")}
                {product.remark}
              </div>

              <div className="mt-0 flex items-center justify-between gap-2">
                <div className="flex flex-1 flex-col">
                  <span className="text-price-base">
                    {currency.symbol}
                    {product.price}
                  </span>
                </div>
                <Stepper disabled value={product.quantity} />
              </div>
            </div>
          </div>

          {/* 增值服务 */}
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
        </div>
      ))}

      {/* 底部合计 */}
      <div className="mt-2 text-right">
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
    </div>
  );
}
