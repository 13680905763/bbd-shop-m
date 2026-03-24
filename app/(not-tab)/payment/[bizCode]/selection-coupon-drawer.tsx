import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@heroui/react";

import { CommonDrawer } from "@/components/drawer";
import { CouponItem } from "@/components/item-list";

interface SelectionCouponDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  couponList: any[];
  selectedCouponId?: string;
  onSelect: (coupon: any) => void;
}

export default function SelectionCouponDrawer({
  isOpen,
  onOpenChange,
  couponList,
  selectedCouponId,
  onSelect,
}: SelectionCouponDrawerProps) {
  const t = useTranslations("dashboard.coupon");
  const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(
    selectedCouponId,
  );

  // Sync internal state when prop changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(selectedCouponId);
    }
  }, [isOpen, selectedCouponId]);

  const handleConfirm = () => {
    const selectedCoupon = couponList.find((c) => c.id === tempSelectedId);

    onSelect(selectedCoupon);
    onOpenChange(false);
  };

  const handleToggle = (id: string) => {
    setTempSelectedId((prev) => (prev === id ? undefined : id));
  };

  return (
    <CommonDrawer
      isOpen={isOpen}
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3 py-2">
        {couponList?.map((coupon) => {
          const isSelected = tempSelectedId === coupon.id;

          return (
            <div
              key={coupon.id}
              className="relative cursor-pointer"
              role="button"
              onClick={() => handleToggle(coupon.id)}
            >
              <div className="flex items-center gap-2 p-2">
                <Checkbox
                  isSelected={isSelected}
                  radius="full"
                  size="lg"
                  onValueChange={() => handleToggle(coupon.id)}
                />
                <CouponItem coupon={coupon} />
              </div>
              {isSelected && (
                <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-[#f0700c]" />
              )}
            </div>
          );
        })}

        {(!couponList || couponList.length === 0) && (
          <div className="py-8 text-center text-gray-400">
            {t("available", { count: 0 })}
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
