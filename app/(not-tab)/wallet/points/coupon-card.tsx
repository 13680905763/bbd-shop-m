import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";
import { Button } from "@heroui/react";

export interface ExchangeCoupon {
   createTime: string;
   createdBy: string;
   denomination?: number; // 面额
   discount?: number; // 折扣
   exchangePoints: number; // 兑换所需积分
   expirationDate: number; // 有效期天数
   id: string;
   src: number;
   srcMsg: string;
   thresholdAmount: number;
   title: string;
   type: number; // 1: 面额券, 2: 折扣券
   typeMsg: string;
   updateTime: string;
   updatedBy: string;
}

interface CouponCardProps {
   coupon: ExchangeCoupon;
   onRedeem?: (coupon: ExchangeCoupon) => void;
}

export default function CouponCard({ coupon, onRedeem }: CouponCardProps) {
   const t = useTranslations("components.ui.coupon");
   return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-sm transition-shadow bg-white border border-gray-100 flex flex-col min-h-[220px]">
         <div className={clsx("py-3 px-3 flex flex-col justify-center items-center text-white gap-2 bg-[#f0700c]")}>
            <div className="font-medium text-sm opacity-95 text-center">
               {coupon.title}
            </div>
            <div className="border-2 border-dashed border-white/70  px-4 py-1 flex items-baseline justify-center w-full rounded-md">
               {coupon.type === 1 ? (
                  <>
                     <span className="text-2xl font-bold">{coupon.thresholdAmount}-{coupon.denomination}</span>
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
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left">{coupon?.typeMsg}</span>
               </div>


               <div className="flex items-start">
                  <span className="text-gray-800 w-[50px] flex-shrink-0 font-bold">{t("validity")}:</span>
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left"> { coupon.expirationDate } {t("days")}</span>
               </div>
            </div>
            <div className="border-t border-dashed border-gray-200 mt-2 pt-2 flex flex-col items-center justify-center min-h-[24px]">
               <Button
                  size="sm"
                  color="primary"
                  isDisabled={true}
                  className=" w-full"
                  onPress={() => onRedeem?.(coupon)}
               >
                  {coupon?.exchangePoints} {t("points")}
               </Button>
            </div>
         </div>
      </div>
   );
}
