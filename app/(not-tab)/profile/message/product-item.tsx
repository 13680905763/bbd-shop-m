import { addToast, Divider, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Product } from "./page";

import { deleteCart, updateCart } from "@/services/api/cart";
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
  const handleDelete = (onClose: any) => {
    deleteCart({ idList: [product.id] }).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };
  const handleRemark = (remark: string, onClose: () => void) => {
    console.log("remark", remark);
    updateCart([
      {
        id: product.id,
        quantity: product.quantity,
        remark,
      },
    ]).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };

  const handleQuantity = (quantity: number) => {
    updateCart([
      {
        id: product.id,
        quantity,
        remark: product.remark,
      },
    ]).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };

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
