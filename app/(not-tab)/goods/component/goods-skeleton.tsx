import { Skeleton } from "@heroui/react";

export default function GoodsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* 商品主图占位 */}
      <Skeleton className="w-full rounded-lg">
        <div className="h-[250px] w-full rounded-lg bg-default-300" />
      </Skeleton>

      {/* 商品标题占位 */}
      <Skeleton className="w-full">
        <div className="h-6 w-3/4 rounded-lg bg-default-300" />
      </Skeleton>

      {/* 商品价格占位 */}
      <Skeleton className="w-full">
        <div className="h-6 w-1/4 rounded-lg bg-default-300" />
      </Skeleton>

      {/* 商品描述占位，多行 */}
      <Skeleton className="w-full space-y-2">
        <div className="h-3 w-full rounded-lg bg-default-300" />
        <div className="h-3 w-5/6 rounded-lg bg-default-300" />
        <div className="h-3 w-4/6 rounded-lg bg-default-300" />
      </Skeleton>

      {/* 购买按钮占位 */}
      <Skeleton className="w-full">
        <div className="h-12 w-full rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  );
}
