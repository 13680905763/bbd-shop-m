import React from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { IoCloseCircleOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWaybill: any;
  onConfirm: (waybillId: string) => Promise<void>;
  /** 运单更换路线 */
  onChangeLine: (waybillId: string) => void;
  isCancelling: boolean;
  isChangingLine: boolean;
}

export default function CancelModal({
  isOpen,
  onClose,
  currentWaybill,
  onConfirm,
  onChangeLine,
  isCancelling,
  isChangingLine,
}: CancelModalProps) {
  const t = useTranslations("profile.package");
  const { currency } = useGlobalStore();



  return (
    <CommonModal
      footer={<div />}
      isOpen={isOpen}
      title={t("cancelModal.title")}
      onOpenChange={onClose}
    >
      <div className="flex justify-center gap-6 py-6">
        <Card
          isPressable
          isDisabled={isCancelling || isChangingLine}
          className="w-52 rounded-2xl hover:border-red-500 hover:bg-red-50"
          onPress={() => onConfirm(currentWaybill?.id)}
        >
          <CardBody className="flex flex-col items-center justify-between space-y-3 px-3 py-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              {isCancelling ? (
                <Spinner color="danger" size="lg" />
              ) : (
                <IoCloseCircleOutline className="h-10 w-10 text-red-500" />
              )}
              <p
                className={`text-base font-semibold ${isCancelling ? "text-gray-500" : "text-red-600"
                  }`}
              >
                {isCancelling
                  ? t("cancelModal.cancelCard.submittingTitle")
                  : t("cancelModal.cancelCard.title")}
              </p>

            </div>

            {/* 下半部分：费用明细 */}
            <div className="w-full rounded-xl  pt-2 text-sm text-gray-700">
              <div className="flex justify-between px-2 py-1">
                <span>{t("cancelModal.cancelCard.serviceFee")}</span>
                <span>
                  {currency.symbol}
                  {currentWaybill?.cancelPre?.serviceFee ?? 0}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>{t("cancelModal.cancelCard.packingFee")}</span>
                <span>
                  {currency.symbol}
                  {currentWaybill?.cancelPre?.packingFee ?? 0}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                <span>{t("cancelModal.cancelCard.totalFee")}</span>
                <span>
                  {currency.symbol}
                  {currentWaybill?.cancelPre?.totalFee ?? 0}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 更换路线 */}
        {currentWaybill?.changeFlag && (
          <Card
            isPressable
            isDisabled={isCancelling || isChangingLine}
            className="h-auto w-48  hover:border-blue-500 hover:bg-blue-50"
            onPress={() => onChangeLine(currentWaybill)}
          >
            <CardBody className="flex flex-col items-center justify-center text-center">
              {isChangingLine ? (
                <Spinner color="danger" size="lg" />
              ) : (
                <IoSwapHorizontalOutline className="h-8 w-8 text-blue-500" />
              )}

              <p className="text-lg font-semibold text-blue-600">
                {t("cancelModal.changeRouteCard.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("cancelModal.changeRouteCard.subtitle")}
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </CommonModal>
  );
}
