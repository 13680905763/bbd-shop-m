import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

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
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        {activeTab === "submit" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}

        <div className="text-sm font-medium text-gray-800">
          {/* 订单号 */}
          <span className="font-semibold">
            {t("orderCode")}: {warehouse?.orderCode}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          {/* 创建时间 */}
          {warehouse?.createTime}
        </div>
      </div>

      {/* 商品区域 */}
      <div className="my-4 flex gap-3">
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
            height={110}
            src={product.skuPicUrl || product?.picUrl}
            width={96}
          />
        </button>

        {/* 商品信息 */}
        <div className="flex-1">
          {/* 标题 */}
          <div className="line-clamp-2 text-base font-semibold text-gray-900">
            {product.productTitle}
          </div>

          {/* 属性 */}
          <div className="mt-1 line-clamp-1 text-sm text-gray-500">
            {product.sku?.propName_valueName}
          </div>

          {/* 重量 尺寸 */}
          <div className="mt-2 space-y-1">
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
      <div className="mt-3 flex flex-col gap-4 bg-[#fafafa] p-2">
        {product?.orderServiceList.map((service: any) => (
          <div key={service.id} className="mb-2 flex gap-2">
            <div className="mb-2 text-sm text-[#acacac]">
              {service.serviceName}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>

      {/* 状态 */}
      <div className="mt-3 text-right">
        <p className="my-2 text-sm text-gray-700">
          <span className="text-base font-bold text-[#f0700c]">
            {warehouse?.status}
          </span>
        </p>
      </div>
    </div>
  );
}
