import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Image } from "antd-mobile";

import { CommonDrawer } from "@/components/drawer";

interface SelectionInsuranceDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: any[];
  selectedIds?: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export default function SelectionInsuranceDrawer({
  isOpen,
  onOpenChange,
  items,
  selectedIds = [],
  onConfirm,
}: SelectionInsuranceDrawerProps) {
  const t = useTranslations("components.drawer.selectionService");

  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  // 同步外部选中的状态到内部
  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedIds || []);
    }
  }, [isOpen, selectedIds]);

  const handleToggle = (id: string) => {
    // 单选逻辑：如果已经选中了就取消，如果没有选中则只选中当前这一个
    setTempSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedIds);
    onOpenChange(false);
  };

  return (
    <CommonDrawer
      isOpen={isOpen}
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="flex w-full flex-col gap-3 py-2">
        {items.map((service: any) => {
          const isSelected = tempSelectedIds.includes(service.id);

          return (
            <div
              key={service.id}
              className="relative cursor-pointer rounded-lg border p-3"
              role="button"
              tabIndex={0}
              onClick={() => handleToggle(service.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggle(service.id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <Image
                  alt={service.serviceName}
                  className="flex-shrink-0 rounded-md object-cover"
                  height={40}
                  src={service.sample?.[0] || ""}
                  width={40}
                />
                <div className="flex flex-col">
                  <div className="text-base font-semibold text-gray-900">
                    {service.serviceName}
                  </div>
                  <div className="mt-1 line-clamp-4 text-sm text-gray-500">
                    {service.introduction}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#f0700c]" />
              )}
            </div>
          );
        })}
      </div>
    </CommonDrawer>
  );
}
