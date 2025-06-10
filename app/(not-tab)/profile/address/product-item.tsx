import { addToast, Checkbox, Divider, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

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
    <div className="rounded-box my-3 mb-3 flex flex-col gap-2 p-4">
      <div className="">
        <span className="">张三 13600000000</span>
      </div>
      <div className="line-clamp-2">
        浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室
      </div>
      <Divider className="my-2" />
      <div className="flex justify-between">
        <Checkbox
          className="m-0 p-0"
          classNames={{
            wrapper: "p-0 m-0",
          }}
          // isSelected={isSelected}
          // onChange={(e) => onToggle(e.target.checked)}
        >
          设为默认收货地址
        </Checkbox>
        <div className="flex gap-2">
          <button className="h-6 w-6" onClick={onOpen}>
            <FaTrashAlt className="h-4 w-4" />
          </button>
          <button className="h-6 w-6" onClick={onOpen}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
