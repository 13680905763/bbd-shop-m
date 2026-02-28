import { Image, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageViewer } from "antd-mobile";

import CommonDrawer from "./common-drawer";

import { useGlobalStore } from "@/store";
import { Stepper } from "../ui";

interface ServiceDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  onConfirm: (service: any) => void;
}

export default function SelectionServiceDetailDrawer({
  isOpen,
  onOpenChange,
  service,
  onConfirm,
}: ServiceDetailDrawerProps) {
  const t = useTranslations("components.drawer.selectionServiceDetailDrawer");
  const { currency } = useGlobalStore();
  const [currentService, setCurrentService] = useState<any>(service);
  const [visible, setVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  React.useEffect(() => {
    setCurrentService(service);
  }, [service]);

  const handleConfirm = () => {
    onConfirm(currentService);
  };

  if (!currentService) return null;

  return (
    <CommonDrawer
      confirmText={t("confirm")}
      isOpen={isOpen}
      title={currentService.serviceName}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        {/* 服务介绍 */}
        <div className="space-y-4 rounded-lg bg-[#f8f8f8] p-3">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              {t("serviceIntro")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {currentService.introduction || t("noIntro")}
            </p>
          </div>

          {/* 示例（id != 1 时才展示） */}
          {currentService.sample && currentService.sample.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                {t("sample")}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {currentService.sample.map((url: string, index: any) => (
                  <Image
                    key={url}
                    className="h-full w-full object-cover"
                    radius="none"
                    src={url}
                    onClick={() => {
                      setStartIndex(index); // 点击哪张图片就从哪张开始预览
                      setVisible(true);
                    }}
                  />
                ))}
              </div>
              <ImageViewer.Multi
                key={startIndex} // ★ 让组件强制重新创建
                defaultIndex={startIndex} // 从点击的那张开始
                images={currentService.sample}
                visible={visible}
                onClose={() => setVisible(false)}
              />
            </div>
          )}
        </div>

        {/* 服务费（id != 1 时才展示） */}
        {currentService.id != 1 && (
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-900">{t("serviceFee")}</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">
                {currency.symbol}
                {currentService.price}
              </span>
              {currentService?.stacked == 1 ? (
                <Stepper
                  value={currentService?.quantity}
                  onChange={(quantity) => {
                    setCurrentService({
                      ...currentService,
                      quantity: quantity,
                    });
                  }}
                />
              ) : null}
            </div>
          </div>
        )}

        {/* 备注输入框（id != 1 时才展示） */}
        {currentService.id != 1 && (
          <Textarea
            className="mt-2 w-full"
            classNames={{
              input: "text-base",
            }}
            minRows={3}
            placeholder={t("remarkPlaceholder")}
            value={currentService.remark}
            onChange={(e) =>
              setCurrentService({
                ...currentService,
                remark: e.target.value,
              })
            }
          />
        )}
      </div>
    </CommonDrawer>
  );
}
