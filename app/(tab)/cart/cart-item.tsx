"use client";
import { Checkbox } from "@heroui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

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
  onDelete,
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
      {cart.cartList.map((p: any) => (
        <div key={p.id} className="group relative">
          <ProductItem
            isDisabled={p.status === 3}
            isOperated={true}
            isSelected={isSelected}
            product={p}
            type="cart"
            onRemark={(id: string, remark: string) => onRemark({ id, remark })}
            onToggle={() => toggle(p.id)}
            onUpdateQuantity={(id: string, quantity: number) =>
              onQuantityChange({ id, quantity })
            }
          />
          {p.status === 3 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-50/80 backdrop-blur-[1px]">
              <div className="flex items-center gap-4 rounded-xl p-3">
                <span className="font-medium text-gray-500">
                  {t("itemExpired")}
                </span>
                <button
                  className="p-1 text-gray-400 transition-colors hover:text-red-500"
                  onClick={() => onDelete([p.id])}
                >
                  <FaTrashAlt className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
