import React from "react";
import { useTranslations } from "next-intl";

import CommonDrawer from "./common-drawer";

import WarehouseServiceCard from "@/app/(not-tab)/submit/warehouse/werahouse-service-card";

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: any[];
  onSelect: (id: string, isSelected: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function ServiceSelectionModal({
  isOpen,
  onOpenChange,
  services,
  onSelect,
  onUpdateQuantity,
}: ServiceSelectionModalProps) {
  const t = useTranslations("submit.warehouse");

  return (
    <CommonDrawer
      confirmText={t("confirm")}
      isOpen={isOpen}
      showCancel={false}
      title={t("selectService")}
      onConfirm={() => onOpenChange(false)}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-2 py-2">
        {services?.map((service: any) => (
          <WarehouseServiceCard
            key={service.id}
            service={service}
            onSelect={onSelect}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
        {(!services || services.length === 0) && (
          <div className="py-8 text-center text-gray-400">
            {t("noServices")}
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
