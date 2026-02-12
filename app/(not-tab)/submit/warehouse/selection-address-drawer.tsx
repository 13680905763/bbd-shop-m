import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import { CommonDrawer, EditAddressDrawer } from "@/components/drawer";


import AddressItem from "@/components/list-item/address-item";
import { Address, AddressModalState } from "@/types";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  addressList: Address[];
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
}

export default function SelectionAddressDrawer({
  isOpen,
  onOpenChange,
  addressList,
  selectedAddressId,
  onSelect,
}: AddressSelectionModalProps) {
  const t = useTranslations("submit.warehouse");

  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });

  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);

  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  return (
    <>
      <CommonDrawer
        confirmText={t("confirm")}
        isOpen={isOpen}
        title={t("shippingAddress")}
        onConfirm={() => onOpenChange(false)}
        onOpenChange={onOpenChange}
      >
        <div className="space-y-3 py-2">
          <div
            className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary/50 p-3 text-primary hover:bg-primary/5"
            role="button"
            onClick={handleAddClick}
          >
            + {t("addAddress")}
          </div>

          {addressList?.map((address) => (
            <AddressItem
              key={address.id}
              addressDetail={address}
              isSelected={address.id === selectedAddressId}
              showDeleteButton={false}
              onEdit={() => handleEditClick(address)}
              onClick={(addr) => {
                onSelect(addr);
                onOpenChange(false);
              }}
            />
          ))}

          {(!addressList || addressList.length === 0) && (
            <div className="py-8 text-center text-gray-400">
              {t("noAddress")}
            </div>
          )}
        </div>
      </CommonDrawer>

      <EditAddressDrawer
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleModalOpenChange}
      />
    </>
  );
}
