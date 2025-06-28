import { Button, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ProductItem({ product }: any) {
  const router = useRouter();

  return (
    <>
      <div className="my-3 flex gap-2">
        <button
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
          }
        >
          <Image
            alt="商品图"
            className="rounded-md object-cover"
            classNames={{
              wrapper: "self-start",
            }}
            height={93}
            src={product.skuPicUrl || product?.picUrl}
            width={93}
          />
        </button>
        <div className="flex-1">
          <div className="text-title line-clamp-2">{product.productTitle}</div>
          <div className="text-light-gray line-clamp-2">
            {product.sku.propName_valueName}
          </div>
          <div>订单状态：待支付</div>
        </div>
        <div className="">
          <p>123</p>
          <p>x12</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-b-1 p-2">
        <div>精细拍照</div>
        <Button className="button-white" radius="none" size="sm">
          +add
        </Button>
      </div>
      <div className="flex items-center justify-between p-2">
        <div>留言</div>
        <Button className="button-white" radius="none" size="sm">
          +add
        </Button>
      </div>
    </>
  );
}
