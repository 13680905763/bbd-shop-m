import { Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";

import { CommonDrawer } from "@/components/drawer";
import { useGlobalStore } from "@/store";
import { useEnhancedSelection } from "@/hook/common";
import ProductItem from "@/components/common/product-item";

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
  const { currency } = useGlobalStore();
  const {
    items,
    toggleSelection,
    updateQuantity,
    updateRemark,
    getSelectedItems,
  } = useEnhancedSelection(products || []);

  const handleConfirm = async () => {
    const selected = getSelectedItems();
    if (selected.length === 0) return;
    await onConfirm(selected);
  };

  console.log('darwer render');
  
  return (
    <CommonDrawer
      isOpen
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onCancel}
    >
      <div className="space-y-3 py-2">
        {items.map((product: any, index: number) => (
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
              <ProductItem
                isOperated
                isSelected={() => product.isSelected}
                product={product}
                onRemark={updateRemark}
                onToggle={toggleSelection}
                onUpdateQuantity={updateQuantity}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </CommonDrawer>
  );
}
