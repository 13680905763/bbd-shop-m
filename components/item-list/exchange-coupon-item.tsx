// 积分兑换优惠券组件
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, { memo } from "react";

import { useGlobalStore } from "@/store";

interface ExchangeCouponItemProps {
  userPoints: number;
  coupon: any;
  onExchange?: (coupon: any) => void;
}

const ExchangeCouponItem = memo(function ExchangeCouponItem({
  userPoints,
  coupon,
  onExchange,
}: ExchangeCouponItemProps) {
  const t = useTranslations("components.itemList.exchangeCouponItem");
  const { currency } = useGlobalStore();
  const getBgClass = () => {
    switch (coupon.usedFor) {
      case 0:
        return "bg-[#f0700c]"; // All - Orange (Default)
      case 1:
        return "bg-[#ef4444]"; // Waybill - Red
      case 2:
        return "bg-[#8b5cf6]"; // Order - Purple
      default:
        return "bg-[#f0700c]";
    }
  };

  const bgClass = getBgClass();

  return (
    <div
      className={clsx(
        "relative flex h-24 w-full overflow-hidden rounded-md text-white shadow-sm transition-shadow hover:shadow-md",
        bgClass,
      )}
    >
      <div className="flex w-[100px] shrink-0 flex-col items-center justify-center gap-1 p-2 text-center">
        <div className="text-2xl font-bold leading-none">
          {coupon.type === 1 ? (
            <>
              {currency.symbol}
              {coupon.denomination}
            </>
          ) : (
            <>{coupon?.discount ? Number(coupon.discount * 100) : "0"}%</>
          )}
        </div>
        <div className="leading-tight opacity-90">
          {t("minSpend", {
            amount: coupon.thresholdAmount,
          })}
        </div>
      </div>

      <div className="relative flex h-full w-4 shrink-0 items-center justify-center">
        <div className="h-[80%] border-l border-dashed border-white/40" />
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f8f8f8]" />
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f8f8f8]" />
      </div>
      <div className="flex flex-1 flex-col justify-between overflow-hidden py-2 pl-0 pr-2">
        <div className="flex flex-col gap-0.5">
          <div className="line-clamp-1 text-sm font-bold" title={coupon.title}>
            {coupon.title}
          </div>
          <div className="flex gap-2 text-sm opacity-80">
            <div>
              {t("validity")}: {t("days", { count: coupon.expirationDate })}
            </div>
            <div className="text-sm opacity-80">
              {t("usedFor")}: {coupon?.usedForMsg}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="mb-1 font-bold leading-none text-white">
            {coupon.exchangePoints} {t("points")}
          </div>
          {onExchange && (
            <Button
              className="button-default"
              isDisabled={userPoints < coupon.exchangePoints}
              size="sm"
              onPress={() => onExchange(coupon)}
            >
              {t("redeem")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ExchangeCouponItem;
