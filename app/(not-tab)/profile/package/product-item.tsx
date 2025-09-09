import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function ProductItem({ product, warehouse }: any) {
  const router = useRouter();

  return (
    <>
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
            classNames={{
              wrapper: "self-start",
            }}
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

          {/* 重量 & 尺寸 */}
          <div className="mt-2 space-y-1">
            {/* 重量 */}
            <div className="text-sm font-semibold">
              重量：<span className="ml-1">{warehouse?.weight} g</span>
            </div>
            {/* 尺寸 */}
            <div className="text-sm text-gray-600">
              尺寸：{warehouse.length} × {warehouse.width} × {warehouse.height}{" "}
              cm
            </div>
          </div>
        </div>

        {/* 价格/数量 */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold text-gray-500">
            x{product.quantity}
          </p>
        </div>
      </div>

      {/* 增值服务 */}
      {product?.orderServiceList.map((service: any) => (
        <div key={service.serviceId} className="mb-4 flex gap-2">
          <div className="mb-2 text-sm text-[#acacac]">
            {service.serviceName}
          </div>
          <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
        </div>
      ))}
    </>
  );
}
