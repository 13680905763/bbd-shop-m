import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { FaCamera, FaTrash } from "react-icons/fa";
import { Image } from "antd-mobile";

import { useGlobalStore } from "@/store";
import { CommonDrawer, SelectionServiceDetailDrawer } from "@/components/drawer";

interface ServiceSelectionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: any[];
  onToggleSelection: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateRemark: (id: string, remark: string) => void;
}

export default function SelectionServiceDrawer({
  isOpen,
  onOpenChange,
  items,
  onToggleSelection,
  onUpdateQuantity,
  onUpdateRemark,
}: ServiceSelectionDrawerProps) {
  const t = useTranslations("components.drawer.selectionService");
  const { currency } = useGlobalStore();

  const [currentService, setCurrentService] = useState<any>(null);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = items.find((s: any) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };

  // 保存服务详情备注
  const saveServiceDetail = (updatedService: any) => {
    // 如果是基础拍照（id === 1），直接关掉弹窗，不修改 items
    if (updatedService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }

    onUpdateRemark(updatedService.id, updatedService.remark);
    onUpdateQuantity(updatedService.id, updatedService.quantity);

    // 确保选中
    const currentItem = items.find((i) => i.id === updatedService.id);

    if (currentItem && !currentItem.isSelected) {
      onToggleSelection(updatedService.id);
    }

    setIsServiceDetailOpen(false);
  };

  // 删除已选服务
  const removeService = (serviceId: string) => {
    onToggleSelection(serviceId);
    // 重置备注和数量
    onUpdateRemark(serviceId, "");
    onUpdateQuantity(serviceId, 1);
  };

  return (
    <>
      <CommonDrawer
        isOpen={isOpen}
        title={t("title")}
        onConfirm={() => onOpenChange(false)}
        onOpenChange={onOpenChange}
      >
        <div className="flex w-full flex-col gap-2">
          {items.map((service: any) => (
            <div
              key={service.id}
              className="items-center rounded-lg border p-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    alt={service.serviceName}
                    className="flex-shrink-0 rounded-md object-cover"
                    height={40}
                    src={service.sample[0]}
                    width={40}
                  />
                  <div className="font-semibold text-sm">{service.serviceName}</div>
                </div>
                {service.id == 1 ? (
                  // 免费的 icon
                  <button
                    className="flex h-8 w-16 items-center justify-center gap-1 text-sm text-green-500"
                    type="button"
                    onClick={() => openServiceDetail(service.id)}
                  >
                    <FaCamera />
                    {t("free")}
                  </button>
                ) : (
                  <Button
                    className="button-white"
                    size="sm"
                    type="button"
                    onPress={() => openServiceDetail(service.id)}
                  >
                    {t("add")}
                  </Button>
                )}
              </div>

              {service.isSelected && service.id != 1 && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">
                      {t("remark")}: {service.remark || t("noRemark")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm ">

                    <span className="font-semibold">
                      {currency.symbol}
                      {service.price}
                    </span>
                    <span >
                      x{service.quantity}
                    </span>
                    <Button
                      isIconOnly
                      className="h-6 w-6 min-w-0"
                      variant="light"
                      onPress={() => removeService(service.id)}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CommonDrawer>

      {/* 服务详情弹窗 - 现在嵌套在这里 */}
      {currentService && (
        <SelectionServiceDetailDrawer
          isOpen={isServiceDetailOpen}
          service={currentService}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        />
      )}
    </>
  );
}
