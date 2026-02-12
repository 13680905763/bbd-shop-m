import { Avatar } from "@heroui/react";
import React, { useCallback } from "react";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

interface LineItemProps {
  line: any;
  isSelected?: boolean;
  onClick?: (line: any) => void;
}

export default function LineItem({
  line,
  isSelected = false,
  onClick,
}: LineItemProps) {
  const { currency } = useGlobalStore();

  const handleOnClick = useCallback(() => {
    if (!onClick) return;
    onClick(line.id);
  }, [onClick, line]);

  return (
    <div
      className={clsx(
        "rounded-lg border-2 p-2 transition",
        isSelected ? "border-primary" : "border-gray-200",
      )}
      role="button"
      onClick={handleOnClick}
    >
      <div className="flex w-full gap-2">
        <div className="flex w-[90px] flex-shrink-0 flex-col items-center gap-1">
          <Avatar
            className="h-20 w-20 flex-shrink-0 rounded-sm"
            radius="none"
            src={line.logoUrl}
          />
          <p className="line-clamp-2 text-center text-sm font-semibold leading-tight text-gray-900">
            {line.templateName}
          </p>
          <p className="text-center text-sm font-bold leading-snug text-orange-500">
            {currency.symbol}
            {line.shippingFee}
          </p>
          <p className="text-center text-xs leading-snug text-gray-500">
            {line.shippingLine.minDays}-{line.shippingLine.maxDays} day
          </p>
        </div>
        <div className="line-clamp-5 flex-1 rounded-md bg-gray-50 p-2 text-sm text-gray-600">
          {line.shippingLine.description}
        </div>
      </div>
      {line.disable && line.prompt && (
        <div className="mt-2 rounded-lg bg-red-50 p-2 text-center text-sm text-red-500">
          {line.prompt}
        </div>
      )}
    </div>
  );
}
