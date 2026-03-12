"use client";
import { Checkbox } from "@heroui/react";

import SourceIcon from "@/components/common/source-icon";
import { ProductItem } from "@/components/common";
import { FaTrashAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function CartItem({
  cart,
  isGroupAllSelected,
  toggleGroup,
  isSelected,
  toggle,
  onQuantityChange,
  onRemark,
  onDelete
}: any) {
  const t = useTranslations("cart");

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
      {
        cart.cartList.map((p: any) => (
          // <ProductItem
          //   key={p.id}
          //   isSelected={isSelected}
          //   product={p}
          //   type="cart"
          //   onRemark={onRemark}
          //   onToggle={toggle}
          //   onUpdateQuantity={onQuantityChange}
          // />

          <div key={p.id} className="relative group">
            <ProductItem
              isDisabled={p.status === 3}
              isOperated={true}
              isSelected={isSelected}
              product={p}
              type="cart"
              onRemark={onRemark}
              onToggle={() => toggle(p.id)}
              onUpdateQuantity={onQuantityChange}
            />
            {p.status === 3 && (
              <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-[1px]">
                <div className="flex items-center gap-4 p-3 rounded-xl ">
                  <span className="text-gray-500 font-medium">
                    {t("itemExpired")}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    // title={t("delete")}
                    onClick={() => onDelete(p.id)}
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
