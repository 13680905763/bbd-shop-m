"use client";
import { Avatar, Chip, Card } from "@heroui/react";

interface BackendRoute {
  id?: string;
  templateName?: string; // 模板名
  methodName?: string; // 运输方式名
  logoUrl?: string; // logo
  minDays?: number;
  maxDays?: number;
  firstWeightFee?: number; // 首重价格
  description?: string; // 描述
}

interface RouteCardProps {
  data: BackendRoute;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function RouteCard({
  data,
  isSelected,
  onSelect,
}: RouteCardProps) {
  if (!data) return null;

  const {
    id = "",
    templateName = "",
    methodName = "",
    logoUrl = "",
    minDays = 0,
    maxDays = 0,
    firstWeightFee = 0,
    description = "",
  } = data;

  const name = templateName || methodName;
  const price = `$ ${firstWeightFee.toFixed(2)}`;
  const time = minDays && maxDays ? `${minDays}-${maxDays} days` : "暂无时效";

  return (
    <Card
      isPressable
      className={`!box-border border-2 p-3 ${
        isSelected ? "border-primary" : "border-gray-200"
      } rounded-lg bg-white transition hover:shadow-sm`}
      shadow="none"
      onPress={() => onSelect?.(id)}
    >
      <div className="flex items-start gap-3">
        {/* 左侧：图片 + 标签 */}
        <div className="flex w-[80px] flex-shrink-0 flex-col items-center">
          <Avatar className="h-12 w-12" radius="sm" src={logoUrl} />
          <p className="mt-1 text-center text-xs font-medium">{name}</p>
          <div className="mt-1 flex flex-wrap justify-center gap-1">
            <Chip className="text-[10px]" color="primary" size="sm">
              可投保
            </Chip>
            <Chip className="text-[10px] text-[#fff]" color="success" size="sm">
              免税
            </Chip>
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex flex-1">
          {/* 价格 + 时间 */}
          <div className="flex w-[90px] flex-col items-start justify-center">
            <div className="text-xs text-gray-500">价格</div>
            <div className="text-sm font-bold">{price}</div>
            <div className="mt-2 text-xs text-gray-500">时间</div>
            <div className="text-sm font-bold">{time}</div>
          </div>

          {/* 描述 */}
          <div className="flex flex-1 items-center pl-3">
            <span className="text-xs leading-snug text-gray-600">
              {description || "暂无描述"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
