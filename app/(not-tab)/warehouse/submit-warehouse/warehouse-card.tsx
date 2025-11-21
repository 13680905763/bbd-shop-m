import { Image } from "@heroui/react";

import Stepper from "@/components/stepper";

export default function OrderItem({ warehouse }: any) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
      {/* 商品列表 */}
      <div className="divide-y divide-gray-100">
        <div className="flex gap-3">
          {/* 商品图 */}
          <div>
            <Image
              alt="商品图"
              className="rounded-md object-cover"
              classNames={{
                wrapper: "self-start",
              }}
              height={93}
              referrerPolicy="no-referrer"
              src={warehouse?.orderProduct?.skuPicUrl}
              width={93}
            />
          </div>

          {/* 商品信息 */}
          <div className="flex flex-1 flex-col justify-between">
            {/* 标题 + SKU */}
            <div>
              <div className="line-clamp-1 text-base font-semibold text-gray-900">
                {warehouse?.orderProduct?.productTitle}
              </div>
              <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                {warehouse?.orderProduct?.sku?.propName_valueName}
              </div>
            </div>

            {/* 价格 + 数量 */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#f0700c]">
                  ¥{warehouse?.orderProduct?.price}
                </span>
                <span className="mt-1 text-sm text-gray-600">
                  {warehouse?.length} × {warehouse?.width} × {warehouse?.height}{" "}
                  cm
                </span>
                <span className="text-sm text-gray-600">
                  {warehouse?.weight} g
                </span>
              </div>
              <div>
                <Stepper disabled value={warehouse?.orderProduct?.quantity} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
