import { useContext } from "react";

import { ConfirmContext } from "@/components/common/confirm-provider";

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
