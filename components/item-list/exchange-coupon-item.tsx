// 积分兑换优惠券组件
import { useGlobalStore } from "@/store";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, { memo } from "react";

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
                "w-full rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow flex relative text-white h-24",
                bgClass,
            )}
        >
            <div className="flex w-[100px] shrink-0 flex-col items-center justify-center gap-1 p-2 text-center ">
                <div className="font-bold text-2xl leading-none">
                    {coupon.type === 1 ? (
                        <>
                            {currency.symbol}
                            {coupon.denomination}
                        </>
                    ) : (
                        <>
                            {coupon?.discount ? Number(coupon.discount * 100) : "0"}
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

            <div className="relative w-4 h-full shrink-0 flex items-center justify-center">
                <div className="h-[80%] border-l border-dashed border-white/40" />
                <div className="absolute -top-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-[#f8f8f8] rounded-full" />
                <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-[#f8f8f8] rounded-full" />
            </div>
            <div className="flex flex-1 flex-col justify-between py-2 pr-2 pl-0 overflow-hidden">
                <div className="flex flex-col gap-0.5">
                    <div className="font-bold text-sm line-clamp-1" title={coupon.title}>
                        {coupon.title}
                    </div>
                    <div className="text-sm opacity-80 flex gap-2">
                        <div>
                            {t("validity")}: {t("days", { count: coupon.expirationDate })}
                        </div>
                        <div className="text-sm opacity-80">
                            {t("usedFor")}: {coupon?.usedForMsg}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="font-bold text-white leading-none mb-1">
                        {coupon.exchangePoints} {t("points")}
                    </div>
                    {onExchange && (
                        <Button
                            className="button-default"
                            onPress={() => onExchange(coupon)}
                            isDisabled={userPoints < coupon.exchangePoints}
                            size="sm"
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