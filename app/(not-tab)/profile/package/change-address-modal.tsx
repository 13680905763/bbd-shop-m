import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { CommonDrawer } from "@/components/drawer";


import { useAddressList } from "@/hook/api";
import SelectionAddressDrawer from "../../submit/warehouse/selection-address-drawer";
import SelectionBlock from "@/components/common/selection-block";
import SelectedAddressItem from "../../submit/warehouse/selected-address-item";
import { Textarea } from "@heroui/react";
import { usePreviewChangeLine1 } from "@/hook/api/useWaybill";
import SelectedLineItem from "../../submit/warehouse/selected-line-item";
import SelectionLineDrawer from "../../submit/warehouse/selection-line-drawer";
import { useGlobalStore } from "@/store/global";
import { on } from "events";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentWaybill: any;
  onConfirm: any
}

export default function ChangeAddressModal({
  isOpen,
  onOpenChange,
  currentWaybill,
  onConfirm
}: AddressSelectionModalProps) {
  const t = useTranslations("profile.package.changeAddress");
  const { currency } = useGlobalStore();

  // 地址相关
  const { data: addressList, isLoading: addressLoading } = useAddressList();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [resultMessage, setResultMessage] = useState<{ type: string; text: string } | null>(null);

  const { data: lineData, isPending: isRouteLoading } =
    usePreviewChangeLine1(currentWaybill && selectedAddressId ? {
      id: currentWaybill.id,
      addressId: selectedAddressId,
    } : null);
  const [showRouteModal, setShowRouteModal] = useState(false);

  useEffect(() => {
    if (!Array.isArray(lineData)) {
      setSelectedRouteId(null);
    }
  }, [lineData]);
  useEffect(() => {
    console.log('currentWaybill', currentWaybill);
    console.log('address', currentWaybill?.address?.id);
    setSelectedAddressId(currentWaybill?.address?.id || null);
  }, [currentWaybill]);

  useEffect(() => {
    if (isOpen) {
      setResultMessage(null);
    }
  }, [isOpen]);

  return (
    <>
      <CommonDrawer
        isOpen={isOpen}
        title={t("title")}
        onConfirm={async () => {
          if (resultMessage) {
            onOpenChange(false);
            return;
          }
          const res = await onConfirm({
            customerAddressId: selectedAddressId,
            routeId: selectedRouteId,
            remark,
          });

          if (res) {
            const { result, difference } = res;
            const amount = `${currency.symbol}${difference || 0}`;

            if (result === 0) {
              setResultMessage({
                type: "info",
                text: t("result.noChange"),
              });
            } else if (result === 1) {
              setResultMessage({
                type: "warning",
                text: t("result.payExtra", { amount }),
              });
            } else if (result === 2) {
              setResultMessage({
                type: "success",
                text: t("result.refund", { amount }),
              });
            }
          } else {
            onOpenChange(false);
          }
        }}
        onOpenChange={onOpenChange}
      >
        {resultMessage ? (
          <div
            className={`p-4 rounded-lg text-center border ${resultMessage.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : resultMessage.type === "warning"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
          >
            {resultMessage.text}
          </div>
        ) : (
          <>
            <SelectionBlock
              data={
                addressList?.filter((a: any) => a.id === selectedAddressId) || []
              }
              isLoading={addressLoading}
              renderItem={(address: any) => (
                <SelectedAddressItem
                  key={address.id}
                  addressDetail={address}
                />
              )}
              title={t("selectAddress")}
              onClick={() => setShowAddressModal(true)}
            />
            <SelectionBlock
              data={
                Array.isArray(lineData) && selectedRouteId ? lineData?.filter((a: any) => a.id === selectedRouteId) || [] : []
              }
              isLoading={isRouteLoading}
              emptyText={
                typeof lineData === "string" ? lineData : undefined
              }
              renderItem={(line: any) => (
                <SelectedLineItem
                  key={line.id}
                  line={line}
                />
              )}
              title={t("selectLine")}
              onClick={() => { setShowRouteModal(true) }}
            />
            <Textarea
              placeholder={t("remark")}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </>
        )}
      </CommonDrawer>
      <SelectionAddressDrawer
        addressList={addressList || []}
        isOpen={showAddressModal}
        selectedAddressId={selectedAddressId}
        onOpenChange={setShowAddressModal}
        onSelect={(addr) => setSelectedAddressId(addr.id)}
      />

      <SelectionLineDrawer
        isOpen={showRouteModal}
        onOpenChange={setShowRouteModal}
        onConfirm={(id) => {
          setSelectedRouteId(id);
          setShowRouteModal(false);
        }}
        lines={Array.isArray(lineData) ? lineData : []}
        tip={typeof lineData === "string" ? lineData : ""}
        selectedLineId={selectedRouteId}
      />
    </>
  );
}
