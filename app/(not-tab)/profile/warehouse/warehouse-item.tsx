import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import SourceIcon from "@/components/common/source-icon";

export default function OrderItem({
  warehouse,
  activeTab,
  onChange,
  selected,
}: any) {
  const router = useRouter();
  const t = useTranslations("profile.warehouse");
  const product = warehouse?.orderProduct;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center border-b border-gray-100 pb-2">
        {activeTab === "submit" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}

        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <SourceIcon source={product.source} />
          <div className="font-semibold">
            {/* {t("orderCode")}: */}
            {warehouse?.orderCode}
            <div className="text-xs text-gray-500">{warehouse?.createTime}</div>
          </div>
        </div>
      </div>

      {/* 商品区域 */}
      <div className="my-3 flex gap-3">
        {/* 商品图 */}
        <button
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
          }
        >
          <Image
            alt="商品图"
            className="rounded-lg object-cover shadow-sm"
            classNames={{ wrapper: "self-start" }}
            height={100}
            referrerPolicy="no-referrer"
            src={product.skuPicUrl || product?.picUrl}
            width={100}
          />
        </button>

        {/* 商品信息 */}
        <div className="flex-1">
          <div className="line-clamp-2 text-base font-semibold text-gray-900">
            {product.productTitle}
          </div>
          <div className="line-clamp-1 text-sm text-gray-500">
            {product.sku?.propName_valueName}
          </div>

          {/* 重量 尺寸 */}
          <div>
            <div className="text-sm font-semibold">
              {t("weight")}: <span className="ml-1">{warehouse?.weight} g</span>
            </div>
            <div className="text-sm text-gray-600">
              {t("size")}: {warehouse.length} × {warehouse.width} ×{" "}
              {warehouse.height} cm
            </div>
          </div>
        </div>

        {/* 数量 */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold text-gray-500">
            x{product.quantity}
          </p>
        </div>
      </div>

      {/* 增值服务 */}
      <div className="flex flex-col gap-2 bg-[#fafafa] p-2">
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
      <div className="mt-3 text-right">
        <span className="text-base font-bold text-[#f0700c]">
          {warehouse?.status}
        </span>
      </div>
    </div>
  );
}
