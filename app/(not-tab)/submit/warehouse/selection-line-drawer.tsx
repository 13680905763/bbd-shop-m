import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { CommonDrawer } from "@/components/drawer";
import { LineItem } from "@/components/item-list";

interface SelectionLineDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lines: any[];
  selectedLineId: string | null;
  onConfirm: (id: string) => void | Promise<void>;
  tip?: string;
}

export default function SelectionLineDrawer({
  isOpen,
  onOpenChange,
  lines,
  selectedLineId,
  onConfirm,
  tip,
}: SelectionLineDrawerProps) {
  const t = useTranslations("submit.warehouse");
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedLineId,
  );

  useEffect(() => {
    if (isOpen) {
      setInternalSelectedId(selectedLineId);
    }
  }, [isOpen, selectedLineId]);

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
          <LineItem
            key={line.id}
            isSelected={internalSelectedId === String(line.id)}
            line={line}
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
