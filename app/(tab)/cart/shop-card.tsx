import { Checkbox } from "@heroui/react";
import { AiFillTaobaoSquare } from "react-icons/ai";

import { Product, Shop } from "./page";
import ProductItem from "./product-item";

import { Icon1688 } from "@/components/icons";

type ShopCardProps = {
  shop: Shop;
  selectedMap: { [productId: string]: boolean };
  onToggleItem: (productId: string, checked: boolean) => void;
  onToggleShop: (checked: boolean) => void;
  mutate: any;
  isEdit: boolean;
};

export default function ShopCard({
  shop,
  selectedMap,
  onToggleItem,
  onToggleShop,
  mutate,
  isEdit,
}: ShopCardProps) {
  const isAllSelected = shop.cartList.every((p) => selectedMap[p.id]);

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
        {shop.cartList[0]?.source === "TAOBAO" ? (
          <AiFillTaobaoSquare className="h-[22px] w-[22px] text-[#ff5000]" />
        ) : shop.cartList[0]?.source === "1688" ? (
          <Icon1688 className="text-orange-500" size={22} />
        ) : null}
        <div className="text-title">{shop?.shopName}</div>
      </div>

      {shop.cartList.map((product: Product) => (
        <ProductItem
          key={product.id}
          isEdit={isEdit}
          isSelected={selectedMap[product.id]}
          mutate={mutate}
          product={product}
          onToggle={(checked) => onToggleItem(product.id, checked)}
        />
      ))}
    </div>
  );
}
