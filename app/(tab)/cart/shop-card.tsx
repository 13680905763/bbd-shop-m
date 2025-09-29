"use client";
import { Checkbox, Image, Input } from "@heroui/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";

type ProductItemProps = {
  product: any;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  isEdit: boolean;
  handleProductDelete: (productId: string) => void;
  handleProductQuantity: (productId: string, quantity: number) => void;
  handleProductRemark: (productId: string, remark: string) => void;
};

function ProductItem({
  product,
  isSelected,
  onToggle,
  isEdit,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: ProductItemProps) {
  const router = useRouter();

  return (
    <>
      <div className="my-3 flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{ wrapper: "p-0 m-0" }}
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
            classNames={{ wrapper: "self-start" }}
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
                <button
                  className="h-6 w-6"
                  onClick={() => handleProductDelete(product.id)}
                >
                  <FaTrashAlt />
                </button>
              ) : (
                <Stepper
                  value={product.quantity}
                  onChange={(quantity) =>
                    handleProductQuantity(product.id, quantity)
                  }
                />
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
          <button
            onClick={() => handleProductRemark(product.id, product.remark)}
          >
            <FaEdit className="h-6 w-6" />
          </button>
        }
        placeholder="添加备注"
        size="sm"
        value={product.remark}
      />
    </>
  );
}

type ShopCardProps = {
  shop: any;
  selectedMap: { [productId: string]: boolean };
  onToggleItem: (productId: string, checked: boolean) => void;
  onToggleShop: (checked: boolean) => void;
  isEdit: boolean;
  handleProductDelete: (productId: string) => void;
  handleProductQuantity: (productId: string, quantity: number) => void;
  handleProductRemark: (productId: string, remark: string) => void;
};

export default function ShopCard({
  shop,
  selectedMap,
  onToggleItem,
  onToggleShop,
  isEdit,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: ShopCardProps) {
  const isAllSelected = shop.cartList.every((p: any) => selectedMap[p.id]);

  return (
    <div className="rounded-box mb-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{ wrapper: "p-0 m-0" }}
          isSelected={isAllSelected}
          size="sm"
          onChange={(e) => onToggleShop(e.target.checked)}
        />
        <SourceIcon source={shop.cartList[0]?.source} />
        <div className="text-title">{shop?.shopName}</div>
      </div>

      {shop.cartList.map((product: any) => (
        <ProductItem
          key={product.id}
          handleProductDelete={handleProductDelete}
          handleProductQuantity={handleProductQuantity}
          handleProductRemark={handleProductRemark}
          isEdit={isEdit}
          isSelected={selectedMap[product.id]}
          product={product}
          onToggle={(checked) => onToggleItem(product.id, checked)}
        />
      ))}
    </div>
  );
}
