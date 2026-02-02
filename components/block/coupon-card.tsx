import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";

interface CouponCardProps {
  coupon: any;
  mode?: "display" | "redeem"; // display: 展示模式（带时间），redeem: 兑换模式（带按钮）
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const t = useTranslations("components.ui.coupon");

  // Status 1 is available (Orange), others are Gray
  const isAvailable = coupon.status === 1;
  const themeColor = isAvailable ? "bg-[#f0700c]" : "bg-[#999999]";

  // 兼容字段：优先使用 couponDenomination，否则使用 denomination
  const amount = coupon.couponDenomination || coupon.denomination;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow">
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-2 px-3 py-3 text-white",
          themeColor,
        )}
      >
        {/* <div className="font-medium text-sm opacity-95 text-center">
               {t("minSpend", { amount: coupon.thresholdAmount })}
            </div> */}
        <div className="flex w-full items-baseline justify-center rounded-md border-2 border-dashed border-white/70 px-4 py-1">
          {coupon.couponType === 1 ? (
            <>
              <span className="text-2xl font-bold">
                {coupon.thresholdAmount}-{coupon.couponDenomination}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold">
              {coupon?.discount ? Number(coupon.discount * 100) : "0"}%
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 bg-[#f9fafb] p-3 text-xs text-gray-600">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-start">
            <span className="w-[50px] flex-shrink-0 font-bold text-gray-800">
              {t("type")}:
            </span>
            <span className="flex-1 origin-left scale-90 leading-snug text-gray-700">
              {coupon?.couponTypeMsg}
            </span>
          </div>
          <div className="flex items-start">
            <span className="w-[50px] flex-shrink-0 font-bold text-gray-800">
              {t("src")}:
            </span>
            <span className="flex-1 origin-left scale-90 leading-snug text-gray-700">
              {coupon.srcMsg}
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-center border-t border-dashed border-gray-200 pt-2">
          <div className="origin-bottom scale-90 text-[10px] font-medium text-gray-400">
            {coupon.createTime?.split(" ")[0]} -{" "}
            {String(coupon.expirationDate)?.split(" ")[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
