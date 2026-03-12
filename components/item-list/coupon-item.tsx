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
        "w-full rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex relative text-white h-24",
        bgClass,
      )}
    >
      {/* Left: Discount & Threshold */}
      <div className="flex w-[100px] shrink-0 flex-col items-center justify-center gap-1 p-2 text-center ">
        <div className="font-bold text-2xl leading-none">
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
        <div className=" opacity-90 leading-tight">
          {t("minSpend", {
            amount: coupon.thresholdAmount,
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="relative w-4 h-full shrink-0 flex items-center justify-center">
        {/* Vertical Dashed Line */}
        <div className="h-[80%] border-l border-dashed border-white/40" />
        {/* Top Cutout */}
        <div className="absolute -top-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-[#f8f8f8] rounded-full" />
        {/* Bottom Cutout */}
        <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-[#f8f8f8] rounded-full" />
      </div>

      {/* Right: Title & Info */}
      <div className="flex flex-1 flex-col justify-between py-3 pr-3 pl-0 overflow-hidden">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-sm line-clamp-1" title={coupon.couponTitle}>
            {coupon.couponTitle}
          </div>
          <div className="text-sm opacity-80 flex gap-1" title={coupon.srcMsg}>

            <div >
              {t("usedFor")}: {coupon?.usedForMsg}
            </div>
          </div>

        </div>

        <div className="text-[11px] opacity-70 truncate">
          {coupon.createTime} ~ {coupon.expirationDate}
        </div>
        <div className="text-[11px] opacity-70 truncate">
          {coupon.remark}
        </div>
      </div>
    </div>
  );
}
