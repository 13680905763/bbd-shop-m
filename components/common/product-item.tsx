// 购物车商品项，提交订单商品项，订单商品项
import { useGlobalStore } from "@/store";
import { Checkbox, Image, Input } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { FaEdit } from "react-icons/fa";
import { Stepper } from "../ui";

export default memo(function ProductItem({
    product,
    isOperated = false,
    isSelected,
    onToggle,
    onRemark,
    onUpdateQuantity,
}: any) {
    const t = useTranslations("components.common.productItem"); // ✅ 命名空间 cart
    const { currency } = useGlobalStore();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center gap-2">
                {
                    isOperated && (
                        <Checkbox
                            className="m-0 p-0"
                            classNames={{ wrapper: "p-0 m-0" }}
                            isSelected={isSelected(product.id)}
                            size="sm"
                            onChange={() => onToggle(product.id)}
                        />
                    )
                }
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
                        onClick={() =>
                            router.push(
                                `/goods/${product.source}/${product?.sourceProductId}`,
                            )
                        }
                    >
                        <div className="text-title line-clamp-2">
                            {product.productTitle}
                        </div>
                        <div className="text-light-gray line-clamp-1">
                            {product?.propAndValue?.propName_valueName}
                        </div>
                    </button>
                    <div className="flex items-center justify-between ">
                        <span className="text-base font-bold">
                            {currency.symbol}
                            {product?.price}
                        </span>
                        {isOperated ? (
                            <Stepper
                                min={1}
                                value={product.quantity}
                                onChange={(value) => onUpdateQuantity!(product.id, value)}
                            />
                        ) : (
                            <span className="text-base font-bold">
                                x{product.quantity}
                            </span>
                        )
                        }
                    </div>
                </div>
            </div >
            {isOperated ? (
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
                />)
                : product.remark && <div className="m-2 line-clamp-2">{t("remark")}: {product.remark}</div>}
        </>
    );
})