import { Card, CardBody, Checkbox, Image, Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

export default function RefundModal({
  products,
  onSelect,
  onUpdateQuantity,
  onRemarkChange,
  onSubmit,
  onCancel,
  isDisabled = false,
}: any) {
  const t = useTranslations("profile.order.refundModal");
  const { currency } = useGlobalStore();

  return (
    <CommonModal
      isOpen
      isDisabledConfirm={isDisabled}
      isDismissable={true}
      title={t("title")}
      onConfirm={async () => onSubmit()}
      onOpenChange={onCancel}
    >
      <div className="space-y-3">
        {products.map((product: any, index: number) => (
          <Card
            key={index}
            className={`rounded-lg border shadow-sm transition-all duration-150 ${
              product.isSelected
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white"
            }`}
            isPressable={false}
          >
            <CardBody className="flex flex-col gap-3 p-4">
              <div className="flex gap-3">
                <Checkbox
                  className="mt-1"
                  isDisabled={product.isRefunded || product.canRefundQty === 0}
                  isSelected={product.isSelected || false}
                  size="sm"
                  onValueChange={() => onSelect(product.id)}
                />
                <div className="h-[70px] w-[70px] flex-shrink-0">
                  <Image
                    alt={product.productTitle}
                    className="h-full w-full rounded-md object-cover"
                    height={70}
                    referrerPolicy="no-referrer"
                    src={
                      product.skuPicUrl || product.picUrl || "/placeholder.png"
                    }
                    width={70}
                  />
                </div>

                {/* 商品基本信息 */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-sm font-medium text-gray-900">
                    {product.productTitle}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                    {product?.propAndValue?.propName_valueName || "-"}
                  </span>

                  {product.canRefundQty === 0 && (
                    <span className="mt-0.5 text-xs text-red-400">
                      {t("unrefundable")}
                    </span>
                  )}
                </div>

                {/* 价格 + 数量输入 */}
                <div className="flex flex-col items-end justify-center gap-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {currency.symbol}
                    {product.price}
                  </span>
                  <span className="text-xs text-gray-500">
                    x{product.purchaseQuantity}
                  </span>

                  <div className="mt-1 flex items-center gap-1">
                    <input
                      className="w-16 rounded border px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                      disabled={
                        !product.isSelected ||
                        product.isRefunded ||
                        product.canRefundQty === 0
                      }
                      max={product.canRefundQty}
                      min={1}
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(product.id, Number(e.target.value))
                      }
                    />
                    <span className="text-xs text-gray-400">
                      {t("refundable")} {product.canRefundQty}
                    </span>
                  </div>
                </div>
              </div>

              {/* 第二行：备注输入框 */}
              <div className="">
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
                  onChange={(e) => onRemarkChange(product.id, e.target.value)}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </CommonModal>
  );
}
