import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { BlockSpinner } from "@/components/ui";
import { ExchangeCouponItem } from "@/components/item-list"
import {
  useCouponsConfig,
  usePointExchangeCoupon,
} from "@/hook/api";
import { useConfirm } from "@/hook/common";
import { useUserInfo } from "@/hook/business";
import { addToast } from "@heroui/react";

export default function PointsRecordContent() {
  const { data, isFetching } = useCouponsConfig();
  const { data: user } = useUserInfo();

  const { pointExchangeCoupon, isChanging } = usePointExchangeCoupon();
  const { confirm } = useConfirm();
  const t = useTranslations("wallet.points");

  const handleExchange = useCallback((coupon: any) => {
    confirm({
      title: t("exchangeConfirm.title"),
      content: t("exchangeConfirm.content", { points: coupon.exchangePoints, name: coupon.title }),
      onConfirm: async () => {
        try {
          await pointExchangeCoupon(coupon.id);
        } catch (error: any) {
          addToast({
            title: error?.message || "Coupon redemption failed",
            color: "danger",
          });
        }
      },
    });
  }, [confirm, t, pointExchangeCoupon, isChanging]);
  return (
    <>
      {isFetching && <BlockSpinner />}
      <div className="space-y-2">
        {data?.map((coupon: any) => (
          <ExchangeCouponItem
            userPoints={user?.myPoints || 0}
            key={coupon.id}
            coupon={coupon}
            onExchange={handleExchange}
          />
        ))}
      </div>
    </>
  );
}
