import { Image } from "@heroui/react";
import { useTranslations } from "next-intl";
import { memo } from "react";

// 仓库的商品item
export default memo(function WarehouseProductItem({ warehouse, product }: any) {
  const t = useTranslations("profile.warehouse");

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
      {/* 商品区域 */}
      <div className="flex gap-3">
        <Image
          alt="product"
          className="rounded-lg object-cover shadow-sm"
          classNames={{ wrapper: "self-start" }}
          height={80}
          referrerPolicy="no-referrer"
          src={product.skuPicUrl || product?.picUrl}
          width={80}
        />

        {/* 商品信息 */}
        <div className="flex-1">
          <div className="line-clamp-2 text-sm font-semibold text-gray-900">
            {product.productTitle}
          </div>
          <div className="line-clamp-1 text-xs text-gray-500">
            {product.propAndValue?.propName_valueName}
          </div>
          {/* 重量 尺寸 */}
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
        {/* 数量 */}
        <div className="shrink-0 text-right">
          <p className="text-base font-semibold">x{product.quantity}</p>
        </div>
      </div>
    </div>
  );
});
