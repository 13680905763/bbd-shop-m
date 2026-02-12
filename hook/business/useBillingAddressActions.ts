import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

import { useDeleteAddress } from "../api";
import { useConfirm } from "../common";

import { Address, AddressModalState } from "@/types";

export const useBillingAddressActions = () => {
  const t = useTranslations("profile.billingAddress");
  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
  const { mutateAsync: deleteBillingAddressMutate } = useDeleteAddress();
  const { confirm } = useConfirm();

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);

  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);

  const handleDeleteClick = useCallback(
    async (address: Address) => {
      await confirm({
        content: t("deleteContent"),
        onConfirm: async () => {
          await deleteBillingAddressMutate({ id: address.id });
        },
      });
    },
    [confirm, deleteBillingAddressMutate, t],
  );

  return {
    modalState,
    handleOpenChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
  };
};
