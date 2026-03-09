import { Checkbox } from "@heroui/react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import SourceIcon from "@/components/common/source-icon";
import { WarehouseProductItem } from "@/components/item-list";

export default function WarehouseItem({
  warehouse,
  showCheckbox,
  onChange,
  isSelected,
}: any) {
  const product = warehouse?.orderProduct;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {showCheckbox && (
            <Checkbox
              classNames={{
                base: "p-0 m-0",
                wrapper: "m-0",
              }}
              isSelected={isSelected(warehouse?.packageCode)}
              onChange={() => onChange(warehouse?.packageCode)}
            />
          )}
          <SourceIcon source={product.source} />
          <div className="font-semibold">
            {warehouse?.orderCode}
            <div className="text-xs text-gray-500">{warehouse?.createTime}</div>
          </div>
        </div>
        <div className="self-start text-right text-sm font-bold text-[#f0700c]">
          {warehouse?.status}
        </div>
      </div>
      <WarehouseProductItem product={product} warehouse={warehouse} />
      {/* 增值服务 */}
      <div className="flex flex-col gap-2 rounded-lg bg-[#fafafa] p-2">
        {product?.orderServiceList.map((service: any) => (
          <div key={service.id} className="flex gap-2">
            <div className="text-sm text-[#acacac]">
              {service.serviceName}*{service.quantity}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>
    </div>
  );
}
