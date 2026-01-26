"use client";
import { Avatar, Card } from "@heroui/react";

import { useGlobalStore } from "@/store";

export default function ShippingRouteCard({
  route,
  isSelected,
  onSelect,
}: any) {
  const { currency } = useGlobalStore();

  if (!route) return null;
  const {
    id = "",
    templateName = "",
    methodName = "",
    logoUrl = "",
    firstWeightFee = 0,
    shippingLine,
    disable = false,
    prompt = "",
    shippingFee = 0,
  } = route;
  const { description, minDays, maxDays } = shippingLine;
  const name = templateName || methodName;
  const time = `${minDays}-${maxDays} days`;

  return (
    <Card
      className={`!box-border border-2 p-3 ${isSelected ? "border-primary" : "border-gray-200"
        } rounded-lg bg-white transition hover:shadow-sm`}
      shadow="none"
      isDisabled={disable}
      isPressable={!disable}
      onPress={() => {
        if (disable) return
        onSelect?.(id)
      }}
    >
      <div className="flex w-full gap-2">
        {/* 左侧：logo + 名称 + 价格 + 时间 */}
        <div className="flex w-[90px] flex-shrink-0 flex-col items-center gap-1">
          <Avatar
            className="h-20 w-20 flex-shrink-0 rounded-sm"
            radius="none"
            src={logoUrl}
          />
          <p className="line-clamp-2 text-center text-sm font-semibold leading-tight text-gray-900">
            {name}
          </p>
          <p className="text-center text-sm font-bold leading-snug text-orange-500">
            {currency.symbol}
            {shippingFee}
          </p>
          <p className="text-center text-xs leading-snug text-gray-500">
            {time}
          </p>
        </div>

        {/* 右侧描述 */}
        <div className="line-clamp-5 flex-1 rounded-md bg-gray-50 text-sm text-gray-600">
          {description}
        </div>
      </div>
      {disable && prompt && (
        <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-lg">
          {prompt}
        </div>
      )}
    </Card>
  );
}
