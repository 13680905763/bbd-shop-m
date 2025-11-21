"use client";

import { Card, Image } from "@heroui/react";
import { useState } from "react";

import { useGlobalStore } from "@/store";

export default function ServiceCard({
  id,
  serviceName,
  sample,
  price,
  isSelected,
  onSelect,
  initialCount = 1,
  onCountChange,
  stacked,
}: any) {
  const { currency } = useGlobalStore();
  const [count, setCount] = useState(initialCount);

  const updateCount = (v: number) => {
    const next = Math.max(1, v);

    setCount(next);
    onCountChange?.(id, next);
  };

  return (
    <Card
      isPressable
      as="div"
      className={`cursor-pointer rounded-xl border p-3 transition ${
        isSelected ? "border-primary bg-orange-50" : "border-gray-200 bg-white"
      }`}
      shadow="none"
      onClick={() => onSelect?.(id)}
    >
      <div className="flex gap-3">
        {/* 左侧图片 */}
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            alt={serviceName}
            className="rounded-md object-cover"
            height={80}
            referrerPolicy="no-referrer"
            src={sample}
            width={80}
          />
        </div>

        {/* 右侧内容区域 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 服务名称（2 行展示） */}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
            {serviceName}
          </p>

          {/* 价格 + Stepper */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="whitespace-nowrap font-semibold text-primary">
              {currency.symbol}
              {price}
            </span>

            {/* 数量 Stepper（右侧） */}
            {stacked == 1 && (
              <div
                className="flex flex-shrink-0 items-center overflow-hidden rounded-lg bg-gray-100"
                role="button"
                onClick={(e) => e.stopPropagation()} // 避免点 + - 触发选中卡片
              >
                {/* 减号 */}
                <button
                  className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-200"
                  onClick={() => updateCount(count - 1)}
                >
                  -
                </button>

                {/* 数量显示 */}
                <span className="min-w-[24px] px-2 text-center text-sm text-gray-900">
                  {count}
                </span>

                {/* 加号 */}
                <button
                  className="flex h-7 w-7 items-center justify-center text-gray-600 hover:bg-gray-200"
                  onClick={() => updateCount(count + 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
