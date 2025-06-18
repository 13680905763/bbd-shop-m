import { Divider, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Product } from "./page";

type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();

  return (
    <>
      <Divider className="mt-2" />
      <div className="my-3 flex items-center gap-2">
        <div className="flex-1">
          <div className="text-title line-clamp-2 !text-base">
            {product.productTitle}
          </div>

          <div className="text-light-gray">{product.createTime}</div>
        </div>
      </div>
    </>
  );
}
