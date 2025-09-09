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
      className={`flex flex-1 flex-col items-center rounded-xl border p-2 transition ${
        isSelected ? "border-2 border-primary bg-orange-50" : "border-gray-200"
      } cursor-pointer`}
      shadow="none"
      onClick={() => onSelect?.(id)}
    >
      {/* 图片 */}
      <Image
        alt={serviceName}
        className="mb-2 h-16 w-16 rounded-md border border-gray-200 object-cover"
        src={sample}
      />

      {/* 名称 */}
      <span className="line-clamp-2 text-center text-sm font-medium">
        {serviceName}
      </span>

      {/* 价格 */}
      <span className="mt-1 text-sm font-semibold text-primary">
        ¥{price.toFixed(2)}
      </span>
    </Card>
  );
}
