import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ProductItem({ product, status }: any) {
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
            height={96}
            src={product.skuPicUrl || product?.picUrl}
            width={96}
          />
        </button>

        {/* 商品信息 */}
        <div className="flex-1">
          <div className="line-clamp-1 text-base font-semibold text-gray-900">
            {product.productTitle}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-gray-500">
            {product.sku?.propName_valueName}
          </div>
          <div className="mt-1 font-semibold text-[#f0700c]">
            订单状态：<span className="text-[#f0700c]">{status}</span>
          </div>
        </div>

        {/* 价格/数量 */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold text-[#f0700c]">
            ￥{product.price}
          </p>
          <p className="mt-1 text-sm text-gray-500">x{product.quantity}</p>
        </div>
      </div>

      {/* 增值服务 */}
      {product?.orderServiceList?.length > 0 && (
        <div className="mt-2 rounded-lg bg-[#fafafa] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">增值服务</span>
            {product.orderServiceList.map((service: any) => (
              <span
                key={service.serviceId}
                className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-sm text-gray-700 shadow-sm"
              >
                {service.serviceName}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
