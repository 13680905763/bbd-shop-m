import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { CommonDrawer } from "@/components/drawer";


import { LineItem } from "@/components/list-item";

interface SelectionLineDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lines: any[];
  selectedRouteId: string | null;
  onConfirm: (id: string) => void | Promise<void>;
  tip?: string;
}

export default function SelectionLineDrawer({
  isOpen,
  onOpenChange,
  lines,
  selectedRouteId,
  onConfirm,
  tip,
}: SelectionLineDrawerProps) {
  const t = useTranslations("submit.warehouse");
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedRouteId);

  useEffect(() => {
    if (isOpen) {
      setInternalSelectedId(selectedRouteId);
    }
  }, [isOpen, selectedRouteId]);

  const handleConfirm = async () => {
    if (internalSelectedId) {
      await onConfirm(internalSelectedId);
    }
    onOpenChange(false);
  };

  return (
    <CommonDrawer
      isOpen={isOpen}
      title={t("deliveryRoute")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3 py-2">
        {lines?.map((line) => (
          <LineItem key={line.id} line={line}
            isSelected={internalSelectedId === String(line.id)}
            onClick={(lineId) => setInternalSelectedId(String(lineId))}
          />
        ))}

        {(!lines || lines.length === 0) && (
          <div className="flex h-[20vh] flex-col items-center justify-center text-gray-500">
            <p className="mb-2 text-lg">{tip || t("noRoutes")}</p>
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
