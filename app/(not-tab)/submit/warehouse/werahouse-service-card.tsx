"use client";

import { Image } from "antd-mobile";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

export default function WarehouseServiceCard({
  service,
  onSelect,
  onUpdateQuantity,
  size = "md", // 新增 size 属性
}: any) {
  const { currency } = useGlobalStore();

  if (size === "sm") {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Image
            alt={service.serviceName}
            className="flex-shrink-0 rounded-md object-cover"
            height={40}
            src={service.sample}
            width={40}
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-gray-900">
              {service.serviceName}
            </span>
            <span className="text-xs font-medium text-primary">
              {currency.symbol}
              {service.price}
              {service.stacked == 1 && ` x ${service.quantity}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className={clsx(
        "relative w-full cursor-pointer rounded-xl border p-3 text-left transition",
        service.isSelected
          ? "border-2 border-primary bg-orange-50"
          : "border-gray-200 bg-white",
      )}
      onClick={() => onSelect?.(service.id)}
    >
      <div className="flex gap-3">
        {/* 左侧图片 */}
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            alt={service.serviceName}
            className="rounded-md object-cover"
            height={80}
            src={service.sample}
            width={80}
          />
        </div>

        {/* 右侧内容区域 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 服务名称（2 行展示） */}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
            {service.serviceName}
          </p>
          {/* 价格 + Stepper */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="whitespace-nowrap font-semibold text-primary">
              {currency.symbol}
              {service.price}
            </span>
            {/* 数量 Stepper（右侧） */}
            {service.stacked == 1 && (
              <div
                className="flex flex-shrink-0 items-center overflow-hidden rounded-lg bg-gray-100"
                role="button"
                onClick={(e) => e.stopPropagation()} // 避免点 + - 触发选中卡片
              >
                {/* 减号 */}
                <div
                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200"
                  role="button"
                  onClick={() =>
                    onUpdateQuantity?.(service.id, service.quantity - 1)
                  }
                >
                  -
                </div>
                {/* 数量显示 */}
                <span className="min-w-[24px] px-2 text-center text-sm text-gray-900">
                  {service.quantity}
                </span>
                {/* 加号 */}
                <div
                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200"
                  role="button"
                  onClick={() =>
                    onUpdateQuantity?.(service.id, service.quantity + 1)
                  }
                >
                  +
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
