import { Image } from "@heroui/react";
import { useTranslations } from "next-intl";
import { memo } from "react";

// 仓库的商品item
export default memo(function WarehouseProductItem({ warehouse, product }: any) {
  const t = useTranslations("components.block.warehouseProductItem");

  return (
    <div className="rounded-xl bg-white p-2">
      <div className="flex gap-3">
        <Image
          alt="product"
          className="rounded-lg object-cover"
          classNames={{ wrapper: "self-start" }}
          height={80}
          referrerPolicy="no-referrer"
          src={product.skuPicUrl || product?.picUrl}
          width={80}
        />

        <div className="flex-1">
          <div className="line-clamp-2 text-sm font-semibold text-gray-900">
            {product.productTitle}
          </div>
          <div className="line-clamp-1 text-xs text-gray-500">
            {product.propAndValue?.propName_valueName}
          </div>
          <div>
            <div className="text-xs text-gray-500">
              {t("weight")}: <span className="ml-1">{warehouse?.weight} g</span>
            </div>
            <div className="text-xs text-gray-500">
              {t("size")}: {warehouse.length} × {warehouse.width} ×{" "}
              {warehouse.height} cm
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-semibold">x{warehouse.quantity}</p>
        </div>
      </div>
    </div>
  );
});
