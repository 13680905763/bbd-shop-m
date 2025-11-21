import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import SourceIcon from "@/components/common/source-icon";

export default function OrderItem({
  order,
  onPayOrderRedirect,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
  revokeRefund,
}: any) {
  const t = useTranslations("profile.order"); // ✅ 命名空间

  const router = useRouter();
  const { currency } = useGlobalStore();

  // 内联 ProductItem 保持原样式
  const ProductItem = ({ product, status }: any) => (
    <>
      <div className="my-4 flex gap-3">
        {/* 商品图 */}
        <button
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
          }
        >
          <Image
            alt="商品图"
            className="rounded-lg object-cover shadow-sm"
            classNames={{ wrapper: "self-start" }}
            height={96}
            referrerPolicy="no-referrer"
            src={product.skuPicUrl || product?.picUrl}
            width={96}
          />
        </button>

        {/* 商品信息 */}
        <div className="flex-1">
          <div className="line-clamp-1 text-base font-semibold text-gray-900">
            {product.productTitle}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-gray-500">
            {product.sku?.propName_valueName}
          </div>
          {product?.withdrawRefundFlag && (
            <>
              <div className="text-red-500">
                {product?.refundStatus} *{product?.applyRefundQty}
              </div>
              <button
                className="text-blue-500"
                onClick={() => revokeRefund(product?.refundId)}
              >
                {t("withdrawRequest")}
              </button>
            </>
          )}
        </div>

        {/* 价格/数量 */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold text-[#f0700c]">
            {currency.symbol}
            {product.price}
          </p>
          <p className="mt-1 text-sm text-gray-500">x{product.quantity}</p>
        </div>
      </div>

      {/* 增值服务 */}
      {product?.orderServiceList?.length > 0 && (
        <div className="mt-2 rounded-lg bg-[#fafafa] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.orderServiceList.map((service: any) => (
              <span
                key={service.serviceId}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-sm text-gray-700 shadow-sm"
              >
                {service.serviceName}*{service.quantity}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center border-gray-100">
        {activeTab === "waitPay" && (
          <Checkbox isSelected={selected} onChange={onChange} />
        )}

        <div className="flex gap-2 text-sm font-medium text-gray-800">
          <SourceIcon source={order.source} />
          <div className="font-semibold">
            {order?.orderCode}
            <div className="flex-1 text-xs text-gray-500">
              {order?.createTime}
            </div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="divide-y divide-gray-100">
        {order?.products.map((product: any, index: number) => (
          <ProductItem
            key={product.id}
            product={product}
            status={order.status}
          />
        ))}
      </div>
      <div className="mt-1 font-semibold text-[#f0700c]" />
      {/* 金额 + 按钮 */}
      <div className="text-right">
        <span className="text-sm font-bold text-[#f0700c]">
          {order?.status}
        </span>
        <p className="text-sm text-gray-700">
          <span className="text-lg font-bold text-[#f0700c]">
            {currency.symbol}
            {order?.totalFee}
          </span>
        </p>

        {order?.canCancelFlag && (
          <div className="space-x-2">
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => onPayOrderRedirect(order?.orderCode)}
            >
              {t("pay")}
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => onCancelOrder(order?.id)}
            >
              {t("cancel")}
            </Button>
          </div>
        )}
        {order?.canRefundFlag && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={onRequestRefund}
          >
            {t("requestRefund")}
          </Button>
        )}
      </div>
    </div>
  );
}
