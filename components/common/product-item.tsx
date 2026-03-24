// 购物车商品项，提交订单商品项，订单商品项
import { Checkbox, Image, Input, Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { FaEdit } from "react-icons/fa";

import { Stepper } from "../ui";

import { useGlobalStore } from "@/store";

export default memo(function ProductItem({
  product,
  type = "order",
  isSelected,
  onToggle,
  onRemark,
  onUpdateQuantity,
  isExpired = false,
}: any) {
  const t = useTranslations("components.common.productItem");
  const { currency } = useGlobalStore();
  const router = useRouter();
  const isOperated = type === "cart" || type === "refund";

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        {isOperated && (
          <Checkbox
            className="m-0 p-0"
            classNames={{ wrapper: "p-0 m-0" }}
            isSelected={isSelected(product.id)}
            size="sm"
            onChange={() => onToggle(product.id)}
          />
        )}
        <Image
          alt="商品图"
          className="rounded-md object-cover"
          classNames={{ wrapper: "self-start" }}
          height={93}
          referrerPolicy="no-referrer"
          src={product.skuPicUrl || product?.picUrl}
          width={93}
        />
        <div className="flex-1 space-y-2">
          <button
            className="text-left"
            onClick={() => {
              if (isExpired) return;
              if (type === "refund") return;
              router.push(
                `/goods/${product.source}/${product?.sourceProductId}`,
              );
            }}
          >
            <div className="text-title line-clamp-2">
              {product.productTitle}
            </div>
            <div className="text-light-gray line-clamp-1">
              {product?.propAndValue?.propName_valueName}
            </div>
          </button>
          <div className="flex items-center justify-between">
            {product?.price && (
              <span className="text-base font-bold">
                {currency.symbol}
                {product?.price}
              </span>
            )}
            {product.quantity && isOperated ? (
              <Stepper
                max={type === "refund" ? product?.canRefundQty : undefined}
                min={1}
                value={product.quantity}
                onChange={(value) => onUpdateQuantity!(product.id, value)}
              />
            ) : (
              <span className="text-base font-bold">x{product.quantity}</span>
            )}
          </div>
        </div>
      </div>
      {type === "cart" ? (
        <Input
          isReadOnly
          classNames={{ inputWrapper: "bg-[#f8f8f8]", input: "!text-[#333]" }}
          endContent={
            <button onClick={() => onRemark(product.id, product.remark)}>
              <FaEdit className="h-6 w-6" />
            </button>
          }
          placeholder={t("placeholder")}
          size="sm"
          value={product.remark}
        />
      ) : type === "order" ? (
        product.remark && (
          <div className="m-2 line-clamp-2">
            {t("remark")}: {product.remark}
          </div>
        )
      ) : (
        <Textarea
          classNames={{
            inputWrapper:
              "bg-white border border-gray-300 rounded-md shadow-none " +
              "focus-within:bg-white focus-within:border-primary " +
              "focus-within:ring-1 focus-within:ring-primary transition-colors",
            input: "text-sm text-gray-800 placeholder:text-gray-400",
          }}
          minRows={2}
          placeholder={t("placeholder")}
          value={product.remark || ""}
          onChange={(e) => onRemark(product.id, e.target.value)}
        />
      )}
    </>
  );
});
