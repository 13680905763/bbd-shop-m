import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function PackageItem({
  pack,
  activeTab,
  onChange,
  selected,
}: any) {
  const router = useRouter();

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：包裹号 + 创建时间 */}
      <div className="flex items-center justify-between pb-2">
        {activeTab === "pay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <div className="text-sm font-medium text-gray-800">
          <span className="font-semibold">{pack?.packingPackageCode}</span>
        </div>
        <div className="text-xs text-gray-500">{pack?.createTime}</div>
      </div>

      {/* 包裹商品列表（合并 ProductItem 内容） */}
      <div className="flex flex-col gap-3">
        {pack.packageItemList.map((item: any) => {
          const product = item?.orderProduct;

          return (
            <div
              key={item.id}
              className="my-2 flex gap-3 border-b pb-3 last:border-none"
            >
              {/* 商品图 */}
              <button
                onClick={() =>
                  router.push(
                    `/goods/${product?.source}/${product?.sourceProductId}`,
                  )
                }
              >
                <Image
                  alt="商品图"
                  className="rounded-lg object-cover shadow-sm"
                  classNames={{ wrapper: "self-start" }}
                  height={110}
                  src={product?.skuPicUrl || product?.picUrl}
                  width={96}
                />
              </button>

              {/* 商品信息 */}
              <div className="flex-1">
                {/* 标题 */}
                <div className="line-clamp-2 text-base font-semibold text-gray-900">
                  {product?.productTitle}
                </div>

                {/* 属性 */}
                <div className="mt-1 line-clamp-1 text-sm text-gray-500">
                  {product?.sku?.propName_valueName}
                </div>

                {/* 重量 & 尺寸 */}
                <div className="mt-2 space-y-1">
                  <div className="text-sm font-semibold">
                    重量：
                    <span className="ml-1">{pack?.weight} g</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    尺寸：{pack?.length} × {pack?.width} × {pack?.height} cm
                  </div>
                </div>
              </div>

              {/* 数量 */}
              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-gray-500">
                  x{product?.quantity}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 包裹信息（右侧汇总） */}
      <div className="mt-3 flex flex-col gap-1 text-sm">
        <div className="text-gray-700">
          <span className="font-medium text-gray-600">物流方式: </span>
          <span className="text-gray-800">
            {pack?.shipping?.methodCode || "暂无"}
          </span>
        </div>
        <div className="text-gray-700">
          <span className="font-medium text-gray-600">服务费: </span>
          <span className="text-gray-800">{pack?.totalServiceFee || 0}</span>
        </div>
        <div className="text-sm font-semibold text-orange-500">
          <span className="font-medium text-gray-600">总费用: </span>
          <span>{pack?.totalFee || 0}</span>
        </div>
      </div>

      {/* 服务列表 */}
      <div className="mt-3 flex flex-col gap-4 bg-[#fafafa] p-2">
        {pack?.serviceList.map((service: any) => (
          <div key={service.serviceId} className="flex gap-2">
            <div className="mb-2 text-sm text-[#acacac]">
              {service.serviceName}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>

      {/* 状态 */}
      <div className="mt-3 text-right">
        <div className="text-base font-bold text-[#f0700c]">{pack?.status}</div>
      </div>
    </div>
  );
}
