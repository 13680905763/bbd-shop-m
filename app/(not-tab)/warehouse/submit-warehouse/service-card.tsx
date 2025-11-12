"use client";
import { Card, Image } from "@heroui/react";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ServiceCard({
  id,
  serviceName,
  sample,
  price,
  isSelected,
  onSelect,
}: any) {
  return (
    <Card
      isPressable
      className={`rounded-xl border transition ${
        isSelected ? "border-2 border-primary bg-orange-50" : "border-gray-200"
      } cursor-pointer`}
      shadow="none"
      onClick={() => onSelect?.(id)}
    >
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* 图片 */}
        <Image
          alt={serviceName}
          className="h-16 w-16 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
          src={sample}
        />

        {/* 文本信息 */}
        <div className="flex flex-1 flex-col justify-between">
          {/* 服务名 */}
          <span className="line-clamp-2 text-sm font-medium leading-snug text-gray-800">
            {serviceName}
          </span>

          {/* 价格 */}
          <span className="mt-1 text-base font-semibold text-primary">
            ¥{price.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
