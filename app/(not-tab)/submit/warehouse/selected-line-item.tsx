import { Avatar } from "@heroui/react";
import { useGlobalStore } from "@/store";
import { memo } from "react";


export default memo(function SelectedLineItem({
  line,
}: any) {
  const { currency } = useGlobalStore();

  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <Avatar
        className="h-10 w-10 flex-shrink-0 rounded-sm bg-white"
        radius="none"
        src={line.logoUrl}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span className="truncate pr-2 text-sm font-semibold text-gray-900">
            {line.templateName}
          </span>
          <span className="flex-shrink-0 text-sm font-bold ">
            {currency.symbol}
            {line.shippingFee}
          </span>
        </div>
        <span className="text-sm text-gray-500">   {line.shippingLine.minDays}-{line.shippingLine.maxDays} day</span>
      </div>
    </div>
  );
});
