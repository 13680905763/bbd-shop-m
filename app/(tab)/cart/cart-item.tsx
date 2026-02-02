"use client";
import { Checkbox } from "@heroui/react";

import SourceIcon from "@/components/common/source-icon";
import { ProductItem } from "@/components/common";

export default function CartItem({
  cart,
  isGroupAllSelected,
  toggleGroup,
  isSelected,
  toggle,
  onQuantityChange,
  onRemark,
}: any) {
  return (
    <div className="space-y-2 rounded-lg bg-white px-2 py-3">
      <div className="flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{ wrapper: "p-0 m-0" }}
          isSelected={isGroupAllSelected(cart.shopId)}
          size="sm"
          onChange={() => toggleGroup(cart.shopId)}
        />
        <SourceIcon source={cart.cartList[0]?.source} />
        <div className="text-title">{cart?.shopName}</div>
      </div>
      {cart.cartList.map((p: any) => (
        <ProductItem
          key={p.id}
          isOperated={true}
          isSelected={isSelected}
          product={p}
          onRemark={onRemark}
          onToggle={toggle}
          onUpdateQuantity={onQuantityChange}
        />
      ))}
    </div>
  );
}
