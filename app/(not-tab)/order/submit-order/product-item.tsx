import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Product } from "./page";

import Stepper from "@/components/stepper";
type ProductItemProps = {
  product: Product;
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
      <div className="my-3 flex gap-2">
        <div>
          <button
            onClick={() =>
              router.push(
                `/goods/${product.source}/${product?.sourceProductId}`,
              )
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
        </div>
        <div className="flex-1">
          <div className="text-title line-clamp-1 !text-base">
            {product.productTitle}
          </div>
          <div className="text-light-gray line-clamp-2">
            {product.sku.propName_valueName}
          </div>
          <div className="line-clamp-1 !text-sm">备注：{product.remark}</div>

          <div className="mt-0 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col">
              <span className="text-price-base">¥{product.price}</span>
            </div>

            <div className="flex items-center gap-1">
              <Stepper
                disabled={true}
                value={product.quantity}
                // onChange={handleQuantity}
              />
            </div>
          </div>
          <div className="text-light-gray">运费:{product.postFee}</div>
        </div>
      </div>
    </>
  );
}
