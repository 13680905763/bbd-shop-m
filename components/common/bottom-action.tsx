import { useGlobalStore } from "@/store";
import { Button, Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";
import React from "react";

interface BottomActionProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  selectedCount: number;
  isLoading: boolean;
  onPress: () => void;
  buttonText?: string;
  selectAllText?: string;
  togglePrice?: number | string;
}

export default function BottomAction({
  isAllSelected,
  onToggleSelectAll,
  selectedCount,
  isLoading,
  onPress,
  buttonText,
  selectAllText,
  togglePrice,
}: BottomActionProps) {
  const t = useTranslations("components.common.bottomAction");
  const { currency } = useGlobalStore();

  return (
    <div className="card-cart sticky bottom-0 z-10 bg-white p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
          {selectAllText || t("selectAll")}
        </Checkbox>
        <div className="flex items-center gap-2">
          {togglePrice && (
            <p className="text-price-lg">
              {currency.symbol}
              {togglePrice}
            </p>
          )}
          <Button
            className="w-[120px]"
            color="primary"
            isDisabled={selectedCount === 0}
            isLoading={isLoading}
            onPress={onPress}
          >
            {buttonText || t("submit")}{" "}
            {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
