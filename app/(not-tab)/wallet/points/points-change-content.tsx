import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { BlockSpinner } from "@/components/ui";
import { ExchangeCouponItem } from "@/components/item-list"
import {
  useCouponsConfig,
  usePointExchangeCoupon,
  useUserInfo
} from "@/hook/api";
import { useConfirm } from "@/hook/common";

export default function PointsRecordContent() {
  const { data, isFetching } = useCouponsConfig();
  const { data: user } = useUserInfo();

  const { mutateAsync: pointExchangeCoupon } = usePointExchangeCoupon();
  const { confirm } = useConfirm();
  const t = useTranslations("wallet.points");

  const handleExchange = useCallback((coupon: any) => {
    confirm({
      title: t("exchangeConfirm.title"),
      content: t("exchangeConfirm.content", { points: coupon.exchangePoints, name: coupon.title }),
      onConfirm: async () => {
        await pointExchangeCoupon(coupon.id);
      },
    });
  }, [confirm, t, pointExchangeCoupon]);
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
