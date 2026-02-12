import { Button, Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";
import React from "react";

import { useGlobalStore } from "@/store";
import SourceIcon from "@/components/common/source-icon";
import CopyButton from "@/components/common/copy-button";
import { ProductItem } from "@/components/common";
import RefundCountdown from "@/components/ui/refund-countdown";

export default function OrderItem({
  order,
  onPay,
  onCancel,
  showCheckbox,
  onChange,
  isSelected,
  onRefund,
  onRevoke,
}: any) {
  const t = useTranslations("profile.order.buttons"); // ✅ 命名空间

  const [isPaying, setIsPaying] = React.useState(false);

  const { currency } = useGlobalStore();

  return (
    <div className="space-y-3 rounded-xl bg-white p-3">
      <div className="flex items-center justify-between">
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

      {order?.products.map((product: any) => (
        <React.Fragment key={product?.id}>
          <ProductItem product={product} />
          {product?.orderServiceList?.length > 0 && (
            <div className="rounded-lg bg-[#fafafa] px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                {product.orderServiceList.map((service: any) => (
                  <span
                    key={service.id}
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
            </div>
          )}
        </React.Fragment>
      ))}
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
              isLoading={isPaying}
              radius="sm"
              size="sm"
              onPress={async () => {
                setIsPaying(true);
                await onPay([order?.orderCode]);
                setIsPaying(false);
              }}
            >
              {t("pay")}
            </Button>
          </div>
        )}
        {order?.canRefundFlag && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={() => onRefund(order)}
          >
            {t("refund")}
            {order?.refundTimeStamp && (
              <RefundCountdown timestamp={order?.refundTimeStamp} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
