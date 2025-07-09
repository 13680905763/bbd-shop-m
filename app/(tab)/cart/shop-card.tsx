import { Checkbox } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

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
          classNames={{
            wrapper: "p-0 m-0",
          }}
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
