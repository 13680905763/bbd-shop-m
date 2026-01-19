import { Checkbox, Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import SourceIcon from "@/components/common/source-icon";

export default function WarehouseItem({
  warehouse,
  activeTab,
  onChange,
  selected,
}: any) {
  const t = useTranslations("profile.warehouse");
  const product = warehouse?.orderProduct;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {activeTab === "submit" && (
            <Checkbox
              classNames={{
                base: "p-0 m-0",
                wrapper: "m-0",
              }}
              isSelected={selected}
              onChange={onChange}
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

      {/* 商品区域 */}
      <div className="my-3 flex gap-3">
        <Image
          alt="商品图"
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

      {/* 状态 */}
      {/* <div className="mt-3 text-right">
        <span className="text-base font-bold text-[#f0700c]">
          {warehouse?.status}
        </span>
      </div> */}
    </div>
  );
}
