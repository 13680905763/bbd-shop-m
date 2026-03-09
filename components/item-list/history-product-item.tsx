import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import { HistoryProduct } from "@/types";

interface ProductItemProps {
  product: HistoryProduct;
  isEdit?: boolean;
  isSelected?: boolean;
  onToggle?: (selected: boolean) => void;
}

export default function HistoryProductItem({
  product,
  isEdit,
  isSelected,
  onToggle,
}: ProductItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (product.source && product.sourceProductId && !isEdit) {
      router.push(`/goods/${product.source}/${product.sourceProductId}`);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-3">
      {isEdit && (
        <Checkbox
          className="m-0 p-0"
          classNames={{
            wrapper: "p-0 m-0",
          }}
          isSelected={isSelected}
          size="sm"
          onValueChange={onToggle}
        />
      )}
      <button
        className="flex flex-1 gap-2 overflow-hidden"
        onClick={handlePress}
      >
        <div className="flex-shrink-0">
          <Image
            alt={product.productTitle || "商品图片"}
            className="rounded-md object-cover"
            classNames={{
              wrapper: "bg-gray-100",
            }}
            height={64}
            referrerPolicy="no-referrer"
            src={product.productPicUrl}
            width={64}
          />
        </div>
        <div className="flex flex-1 flex-col items-start justify-between overflow-hidden">
          <div className="text-title line-clamp-2 text-left leading-tight">
            {product.productTitle}
          </div>
          <div className="text-sm text-gray-400">{product.updateTime}</div>
        </div>
      </button>
    </div>
  );
}
