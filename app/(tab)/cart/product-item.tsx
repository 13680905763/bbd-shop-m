import {
  addToast,
  Button,
  Checkbox,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Product } from "./page";

import Stepper from "@/components/stepper";
import ConfirmModal from "@/components/confirm-modal";
import { deleteCart, updateCart } from "@/services/cart";
type ProductItemProps = {
  product: Product;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  mutate: any;
  isEdit: boolean;
};
const RemarkModal = ({ isOpen, onOpenChange, handleRemark, value }: any) => {
  const [remark, setRemark] = useState(value);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">备注</ModalHeader>
            <ModalBody>
              <Textarea
                placeholder="请输入备注"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </ModalBody>
            <ModalFooter className="flex gap-2">
              <Button
                className="button-default flex-1"
                variant="light"
                onPress={onClose}
              >
                取消
              </Button>
              <Button
                className="flex-1"
                color="primary"
                onPress={() => handleRemark(remark, onClose)}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function ProductItem({
  product,
  isSelected,
  onToggle,
  mutate,
  isEdit,
}: ProductItemProps) {
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
        mutate();
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
        mutate();
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
        mutate();
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
      <div className="my-3 flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{
            wrapper: "p-0 m-0",
          }}
          isSelected={isSelected}
          size="sm"
          onChange={(e) => onToggle(e.target.checked)}
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
            src={product.skuPicUrl || product?.picUrl}
            width={93}
          />
        </button>
        <div className="flex-1">
          <div className="text-title line-clamp-1">{product.productTitle}</div>
          <div className="text-light-gray line-clamp-1">
            {product.sku.propName_valueName}
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col">
              <span className="text-price-base">¥{product?.unitPrice}</span>
            </div>

            <div className="flex items-center gap-1">
              {isEdit ? (
                <button className="h-6 w-6" onClick={onOpen}>
                  <FaTrashAlt />
                </button>
              ) : (
                <Stepper value={product.quantity} onChange={handleQuantity} />
              )}
            </div>
          </div>
          <div className="text-light-gray">运费:{product.postFee}</div>
        </div>
      </div>
      <Input
        isReadOnly
        classNames={{ inputWrapper: "bg-[#f8f8f8]", input: "!text-[#333]" }}
        endContent={
          <button onClick={onOpenRemark}>
            <FaEdit className="h-6 w-6" />
          </button>
        }
        placeholder="添加备注"
        size="sm"
        value={product.remark}
      />
      <ConfirmModal
        content="确定要删除当前商品吗？"
        isOpen={isOpen}
        title="删除购物车"
        onConfirm={handleDelete}
        onOpenChange={onOpenChange}
      />
      <RemarkModal
        handleRemark={handleRemark}
        isOpen={isOpenRemark}
        value={product.remark}
        onOpenChange={onOpenChangeRemark}
      />
    </>
  );
}
