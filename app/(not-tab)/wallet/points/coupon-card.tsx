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
    <div className="flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow">
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-2 bg-[#f0700c] px-3 py-3 text-white",
        )}
      >
        <div className="text-center text-sm font-medium opacity-95">
          {coupon.title}
        </div>
        <div className="flex w-full items-baseline justify-center rounded-md border-2 border-dashed border-white/70 px-4 py-1">
          {coupon.type === 1 ? (
            <>
              <span className="text-2xl font-bold">
                {coupon.thresholdAmount}-{coupon.denomination}
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
              {coupon?.typeMsg}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-[50px] flex-shrink-0 font-bold text-gray-800">
              {t("validity")}:
            </span>
            <span className="flex-1 origin-left scale-90 leading-snug text-gray-700">
              {" "}
              {coupon.expirationDate} {t("days")}
            </span>
          </div>
        </div>
        <div className="mt-2 flex min-h-[24px] flex-col items-center justify-center border-t border-dashed border-gray-200 pt-2">
          <Button
            className="w-full"
            color="primary"
            isDisabled={true}
            size="sm"
            onPress={() => onRedeem?.(coupon)}
          >
            {coupon?.exchangePoints} {t("points")}
          </Button>
        </div>
      </div>
    </div>
  );
}
