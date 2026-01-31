import { Coupon } from "@/types/wallet";
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
      <div className="w-full h-full rounded-lg overflow-hidden shadow-sm transition-shadow bg-white border border-gray-100 flex flex-col ">
         <div className={clsx("py-3 px-3 flex flex-col justify-center items-center text-white gap-2", themeColor)}>
            {/* <div className="font-medium text-sm opacity-95 text-center">
               {t("minSpend", { amount: coupon.thresholdAmount })}
            </div> */}
            <div className="border-2 border-dashed border-white/70  px-4 py-1 flex items-baseline justify-center w-full rounded-md">
               {coupon.couponType === 1 ? (
                  <>
                     <span className="text-2xl font-bold">{coupon.thresholdAmount}-{coupon.couponDenomination}</span>
                  </>
               ) : (
                  <span className="text-2xl font-bold">{coupon?.discount ? Number(coupon.discount * 100) : "0"}%</span>
               )}
            </div>
         </div>
         <div className="p-3 flex flex-col gap-2 text-xs text-gray-600 bg-[#f9fafb] flex-1">
            <div className="flex flex-col gap-1.5 flex-1">
               <div className="flex items-start">
                  <span className="text-gray-800 w-[50px] flex-shrink-0 font-bold">{t("type")}:</span>
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left">{coupon?.couponTypeMsg}</span>
               </div>
               <div className="flex items-start">
                  <span className="text-gray-800 w-[50px] flex-shrink-0 font-bold">{t("src")}:</span>
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left">{coupon.srcMsg}</span>
               </div>
            </div>

            <div className="border-t border-dashed border-gray-200 mt-2 pt-2 flex flex-col items-center justify-center ">
               <div className="text-gray-400 text-[10px] font-medium scale-90 origin-bottom">
                  {coupon.createTime?.split(' ')[0]} - {String(coupon.expirationDate)?.split(' ')[0]}
               </div>
            </div>
         </div>
      </div>
   );
}
