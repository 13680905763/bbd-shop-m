import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import SourceIcon from "@/components/common/source-icon";
import CopyButton from "@/components/common/copy-button";
import { ProductItem } from "@/components/common";
import React from "react";

export default function OrderItem({
  order,
  onPayOrderRedirect,
  onCancel,
  showCheckbox,
  onChange,
  isSelected,
  onRefund,
  onRevoke,
}: any) {
  const t = useTranslations("profile.order.buttons"); // ✅ 命名空间

  const router = useRouter();
  const { currency } = useGlobalStore();

  // 内联 ProductItem 保持原样式
  // const ProductItem = ({ product }: any) => (
  //   <>
  //     <div className="my-3 flex gap-3">
  //       {/* 商品图 */}
  //       <button
  //         onClick={() =>
  //           router.push(`/goods/${product.source}/${product?.sourceProductId}`)
  //         }
  //       >
  //         <Image
  //           alt="商品图"
  //           className="rounded-lg object-cover shadow-sm"
  //           height={80}
  //           referrerPolicy="no-referrer"
  //           src={product.skuPicUrl || product?.picUrl}
  //           width={80}
  //         />
  //       </button>

  //       {/* 商品信息 */}
  //       <div className="flex-1">
  //         <div className="line-clamp-2 text-sm font-semibold text-gray-900">
  //           {product.productTitle}
  //         </div>
  //         <div className="line-clamp-2 text-xs text-gray-500">
  //           {product.propAndValue?.propName_valueName}
  //         </div>
  //       </div>

  //       {/* 价格/数量 */}
  //       <div className="shrink-0 text-right">
  //         <p className="text-base font-semibold">
  //           {currency.symbol}
  //           {product.price}
  //         </p>
  //         <p className="mt-1 text-sm text-gray-500">
  //           x{product.purchaseQuantity}
  //         </p>
  //       </div>
  //     </div>

  //     {/* 增值服务 */}
  //     {product?.orderServiceList?.length > 0 && (
  //       <div className="rounded-lg bg-[#fafafa] px-3 py-2">
  //         <div className="flex flex-wrap items-center gap-2">
  //           {product.orderServiceList.map((service: any) => (
  //             <span
  //               key={service.serviceId}
  //               className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-700 shadow-sm"
  //             >
  //               {service.serviceName}*{service.quantity}
  //             </span>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //     {product?.withdrawRefundFlag && (
  //       <div className="my-2 flex items-center justify-between">
  //         <div className="text-sm font-semibold text-red-500">
  //           {product?.refundStatus} *{product?.applyRefundQty}
  //         </div>
  //         <Button
  //           color="primary"
  //           radius="sm"
  //           size="sm"
  //           onPress={() => onRevokeRefundOrder(product?.refundId)}
  //         >
  //           {t("withdraw")}
  //         </Button>
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <div className="rounded-xl bg-white p-3 space-y-3">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {showCheckbox && (
            <Checkbox
              classNames={{
                base: "p-0 m-0",
                wrapper: "m-0",
              }}
              isSelected={isSelected(order?.orderCode)}
              onChange={() => onChange(order?.orderCode)}
            />
          )}
          <SourceIcon source={order.source} />
          <div className="flex flex-col justify-center font-semibold">
            <div className="flex">
              {order?.orderCode}
              <CopyButton size={12} text={order?.orderCode} />
            </div>
            <div className="text-xs text-gray-500">{order?.createTime}</div>
          </div>
        </div>
        <div className="self-start text-right text-sm font-bold text-[#f0700c]">
          {order?.status}
        </div>
      </div>

      {/* 商品列表 */}
      {order?.products.map((product: any) => (
        <React.Fragment key={product?.id} >
          <ProductItem product={product} />
          {product?.orderServiceList?.length > 0 && (
            <div className="rounded-lg bg-[#fafafa] px-3 py-2" >
              <div className="flex flex-wrap items-center gap-2">
                {product.orderServiceList.map((service: any) => (
                  <span
                    key={service.serviceId}
                    className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs text-gray-700 shadow-sm"
                  >
                    {service.serviceName}*{service.quantity}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product?.withdrawRefundFlag && (
            <div className="my-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-red-500">
                {product?.refundStatus} *{product?.applyRefundQty}
              </div>
              <Button
                color="primary"
                radius="sm"
                size="sm"
                onPress={() => onRevoke(product?.refundId)}
              >
                {t("withdraw")}
              </Button>
            </div >
          )}
        </React.Fragment>
      ))
      }
      <div className="text-right">
        <p className="text-sm text-gray-700">
          <span className="text-base font-bold">
            {currency.symbol}
            {order?.totalFee}
          </span>
        </p>
        {order?.canCancelFlag && (
          <div className="space-x-2">
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => onCancel(order?.id)}
            >
              {t("cancel")}
            </Button>
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => onPayOrderRedirect(order?.orderCode)}
            >
              {t("pay")}
            </Button>
          </div>
        )}
        {order?.canRefundFlag && (
          <Button color="primary" radius="sm" size="sm" onPress={() => onRefund(order)}>
            {t("refund")}
          </Button>
        )}
      </div>
    </div >
  );
}
