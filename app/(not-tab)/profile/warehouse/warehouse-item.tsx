import { Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";

import SourceIcon from "@/components/common/source-icon";
import { WarehouseProductItem } from "@/components/item-list";
import AdditionalServicesGroup from "@/components/common/additional-services";

export default function WarehouseItem({
  warehouse,
  showCheckbox,
  onChange,
  isSelected,
}: any) {
  const t = useTranslations("profile.warehouse");
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
      <AdditionalServicesGroup
        services={product?.orderServiceList}
        prefix={warehouse?.orderCode || warehouse?.packageCode}
      />
    </div>
  );
}
