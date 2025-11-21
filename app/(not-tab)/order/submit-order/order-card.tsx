"use client";

import { Button, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";

export default function OrderCard({ order, openServiceModal }: any) {
  const router = useRouter();

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
            <button
              onClick={() =>
                router.push(
                  `/goods/${product.source}/${product?.sourceProductId}`,
                )
              }
            >
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
            </button>

            {/* 右侧信息 */}
            <div className="flex-1">
              <div className="text-title line-clamp-1 !text-base">
                {product.productTitle}
              </div>
              <div className="text-light-gray line-clamp-2">
                {product.propAndValue.propName_valueName}
              </div>
              <div className="line-clamp-1 !text-sm">
                备注：{product.remark}
              </div>

              <div className="mt-0 flex items-center justify-between gap-2">
                <div className="flex flex-1 flex-col">
                  <span className="text-price-base">¥{product.price}</span>
                </div>

                <Stepper disabled value={product.quantity} />
              </div>

              <div className="text-light-gray">运费:{product.postFee}</div>
            </div>
          </div>

          {/* 增值服务 */}
          <div className="rounded-lg bg-[#f8f8f8] p-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  增值服务
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
                  <span className="text-xs text-gray-400">暂无服务</span>
                )}
              </div>

              <Button
                className="button-white"
                size="sm"
                onPress={() => {
                  openServiceModal(
                    product?.cartId || 1,
                    product?.sku?.propId_valueId,
                  );
                }}
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
