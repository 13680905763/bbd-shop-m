import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Product } from "./page";

type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();

  return (
    <div className="rounded-box my-3 mb-3 flex items-center gap-2 px-2 py-3">
      <Checkbox
        className="m-0 p-0"
        classNames={{
          wrapper: "p-0 m-0",
        }}
        // isSelected={isSelected}
        size="sm"
        // onChange={(e) => onToggle(e.target.checked)}
      />
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
          src={product.skuPicUrl}
          width={93}
        />
      </button>
      <div className="flex h-[93px] flex-1 flex-col justify-between">
        <div className="text-title line-clamp-2">{product.productTitle}</div>
        <div className="">
          <span className="text-price-base">¥{product.price}</span>
        </div>
      </div>
    </div>
  );
}
