import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";

import { CommonDrawer } from "@/components/drawer";
import { useEnhancedSelection } from "@/hook/common";
import ProductItem from "@/components/common/product-item";
import { useEffect } from "react";

interface OrderRefundDrawerProps {
  products: any[];
  onConfirm: (selectedProducts: any[]) => void | Promise<void>;
  onCancel: () => void;
}

export default function OrderRefundDrawer({
  products,
  onConfirm,
  onCancel,
}: OrderRefundDrawerProps) {
  const t = useTranslations("profile.order.refundModal");

  const {
    items,
    toggleSelection: onSelect,
    updateQuantity: onUpdateQuantity,
    updateRemark,
    getSelectedItems,
    selectAll
  } = useEnhancedSelection(products || []);

  const handleConfirm = async () => {
    const selected = getSelectedItems();
    if (selected.length === 0) return;
    await onConfirm(selected);
  };
  useEffect(() => {
    if (products?.length > 0) {
      selectAll();
      products.forEach((product: any) => {
        onUpdateQuantity(product.id, product.canRefundQty);
      });
    }
  }, [products]);

  return (
    <CommonDrawer
      isOpen
      isDisabled={getSelectedItems().length === 0}
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onCancel}
    >
      <div className="space-y-3 py-2">
        {items.map((product: any, index: number) => (
          <Card
            key={index}
            className={`rounded-lg border shadow-sm transition-all duration-150 ${product.isSelected
              ? "border-primary bg-primary/5"
              : "border-gray-200 bg-white"
              }`}
            isPressable={false}
          >
            <CardBody className="flex flex-col gap-3 p-4">
              <ProductItem
                isSelected={() => product.isSelected}
                product={product}
                type="refund"
                onRemark={updateRemark}
                onToggle={onSelect}
                onUpdateQuantity={onUpdateQuantity}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </CommonDrawer>
  );
}
