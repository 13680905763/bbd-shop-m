import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@heroui/react";

import { useCodeExchangeCoupon } from "@/hook/api";

export default function CouponRedemption() {
  const t = useTranslations("dashboard.coupon.couponRedemption");
  const [couponCode, setCouponCode] = useState("");
  const { mutateAsync: exchangeCoupon, isPending: isExchanging } =
    useCodeExchangeCoupon();

  const handleExchange = async () => {
    if (!couponCode.trim()) return;
    try {
      await exchangeCoupon(couponCode);
      setCouponCode("");
    } catch (error) { }
  };

  return (
    <div className="bg-white px-4 shrink-0">
      <div className="flex gap-2">
        <Input
          classNames={{
            input: "text-base",
            inputWrapper: "h-10 bg-gray-100",
          }}
          placeholder={t("inputPlaceholder")}
          value={couponCode}
          onValueChange={setCouponCode}
        />
        <Button
          color="primary"
          isLoading={isExchanging}
          onPress={handleExchange}
        >
          {t("redeem")}
        </Button>
      </div>
    </div>
  );
}
