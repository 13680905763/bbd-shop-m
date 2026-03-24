import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

export default function CouponItem({ coupon }: { coupon: any }) {
  const t = useTranslations("components.itemList.couponItem");
  const { currency } = useGlobalStore();
  const isAvailable = coupon.status === 1;
  // Use orange for available, gray for others
  const getBgClass = () => {
    if (!isAvailable) return "bg-[#cccccc]";
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
      {/* Left: Discount & Threshold */}
      <div className="flex w-[100px] shrink-0 flex-col items-center justify-center gap-1 p-2 text-center">
        <div className="text-2xl font-bold leading-none">
          {coupon.couponType === 1 ? (
            <>
              {currency.symbol}
              {coupon.couponDenomination}
            </>
          ) : (
            <>
              {coupon?.couponDiscount
                ? Number(coupon.couponDiscount * 100)
                : "0"}
              %
            </>
          )}
        </div>
        <div className="leading-tight opacity-90">
          {t("minSpend", {
            amount: coupon.thresholdAmount,
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex h-full w-4 shrink-0 items-center justify-center">
        {/* Vertical Dashed Line */}
        <div className="h-[80%] border-l border-dashed border-white/40" />
        {/* Top Cutout */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f8f8f8]" />
        {/* Bottom Cutout */}
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f8f8f8]" />
      </div>

      {/* Right: Title & Info */}
      <div className="flex flex-1 flex-col justify-between overflow-hidden py-3 pl-0 pr-3">
        <div className="flex flex-col gap-1">
          <div
            className="line-clamp-1 text-sm font-bold"
            title={coupon.couponTitle}
          >
            {coupon.couponTitle}
          </div>
          <div className="flex gap-1 text-sm opacity-80" title={coupon.srcMsg}>
            <div>
              {t("usedFor")}: {coupon?.usedForMsg}
            </div>
          </div>
        </div>

        <div className="truncate text-[11px] opacity-70">
          {coupon.createTime} ~ {coupon.expirationDate}
        </div>
        <div className="truncate text-[11px] opacity-70">{coupon.remark}</div>
      </div>
    </div>
  );
}
