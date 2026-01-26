"use client";

import { Image } from "antd-mobile";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

export default function WarehouseServiceCard({
  service,
  onSelect,
  onUpdateQuantity,
}: any) {
  const { currency } = useGlobalStore();

  return (
    <button
      className={clsx(
        "p-3 rounded-xl border transition cursor-pointer w-full text-left relative",
        service.isSelected
          ? "border-primary bg-orange-50 border-2"
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
        <div className="flex flex-col flex-1 min-w-0">
          {/* 服务名称（2 行展示） */}
          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {service.serviceName}
          </p>
          {/* 价格 + Stepper */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-primary font-semibold whitespace-nowrap">
              {currency.symbol}
              {service.price}
            </span>
            {/* 数量 Stepper（右侧） */}
            {service.stacked == 1 && (
              <div
                className="flex items-center bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                role="button"
                onClick={(e) => e.stopPropagation()} // 避免点 + - 触发选中卡片
              >
                {/* 减号 */}
                <div
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
                  role="button"
                  onClick={() =>
                    onUpdateQuantity?.(service.id, service.quantity - 1)
                  }
                >
                  -
                </div>
                {/* 数量显示 */}
                <span className="px-2 min-w-[24px] text-center text-gray-900 text-sm">
                  {service.quantity}
                </span>
                {/* 加号 */}
                <div
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer"
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
