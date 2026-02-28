import React from "react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWaybill: any;
  onConfirm: (waybillId: string) => Promise<void>;
}

export default function CancelModal({
  isOpen,
  onClose,
  currentWaybill,
  onConfirm,
}: CancelModalProps) {
  const t = useTranslations("profile.package.cancelModal");
  const { currency } = useGlobalStore();

  const totalFee = currentWaybill?.cancelPre?.totalFee ?? 0;

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("title")}
      onConfirm={() => onConfirm(currentWaybill?.id)}
      onOpenChange={onClose}
    >
      <div className="flex flex-col gap-4 py-4">
        {totalFee > 0 ? (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm border border-yellow-200">
            {t("cancelCard.feeNotice", {
              amount: `${currency.symbol}${totalFee}`,
            })}
          </div>
        ) : (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-200">
            {t("cancelCard.freeNotice")}
          </div>
        )}
        {totalFee > 0 && (
          <div className="w-full rounded-xl bg-gray-50 p-4 text-sm text-gray-700 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500">
                {t("cancelCard.serviceFee")}
              </span>
              <span className="font-medium">
                {currency.symbol}
                {currentWaybill?.cancelPre?.serviceFee ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500">
                {t("cancelCard.packingFee")}
              </span>
              <span className="font-medium">
                {currency.symbol}
                {currentWaybill?.cancelPre?.packingFee ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-base font-bold text-red-600">
              <span>{t("cancelCard.totalFee")}</span>
              <span>
                {currency.symbol}
                {totalFee}
              </span>
            </div>
          </div>
        )}
      </div>
    </CommonModal>
  );
}
