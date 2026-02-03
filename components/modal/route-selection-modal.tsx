import React from "react";
import { useTranslations } from "next-intl";

import CommonDrawer from "./common-drawer";

import ShippingRouteCard from "@/app/(not-tab)/submit/warehouse/shipping-route-card";

interface RouteSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  routes: any[];
  selectedRouteId: string | null;
  onSelect: (id: string) => void;
  routesMessage?: string;
}

export default function RouteSelectionModal({
  isOpen,
  onOpenChange,
  routes,
  selectedRouteId,
  onSelect,
  routesMessage,
}: RouteSelectionModalProps) {
  const t = useTranslations("submit.warehouse");

  return (
    <CommonDrawer
      confirmText={t("confirm")}
      isOpen={isOpen}
      showCancel={false}
      title={t("deliveryRoute")}
      onConfirm={() => onOpenChange(false)}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3 py-2">
        {routes?.map((route) => (
          <ShippingRouteCard
            key={route.id}
            isSelected={selectedRouteId === String(route.id)}
            route={route}
            onSelect={(id: any) => {
              onSelect(String(id));
              onOpenChange(false);
            }}
          />
        ))}

        {(!routes || routes.length === 0) && (
          <div className="flex h-[20vh] flex-col items-center justify-center text-gray-500">
            <p className="mb-2 text-lg">{routesMessage || t("noRoutes")}</p>
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
