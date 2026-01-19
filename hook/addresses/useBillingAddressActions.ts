import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Address, AddressModalState } from "@/types";
import { deleteAddress } from "@/services/address";

export const useBillingAddressActions = () => {
  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
  const queryClient = useQueryClient();

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);

  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);

  const handleDeleteClick = useCallback((address: Address) => {
    setModalState({ type: "delete", address });
  }, []);

  const handleDeleteSubmit = useCallback(async () => {
    if (modalState.type !== "delete") return;
    try {
      await deleteAddress({ id: modalState.address.id });
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
      setModalState({ type: null }); // Close modal after successful deletion
    } catch (error) {
      console.error("删除地址失败:", error);
    }
  }, [modalState, queryClient]);

  return {
    modalState,
    handleOpenChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleDeleteSubmit,
  };
};
