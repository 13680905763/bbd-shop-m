"use client";
import { Checkbox, Image, Input } from "@heroui/react";

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
    <div className="rounded-lg bg-white px-2 py-3 space-y-2">
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
          product={p}
          isOperated={true}
          onToggle={toggle}
          isSelected={isSelected}
          onUpdateQuantity={onQuantityChange}
          onRemark={onRemark}
        />
      ))}
    </div>
  );
}
