import React, { useEffect, useState } from "react";
import { Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";

interface EditRemarkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  onSubmit: (value: string) => Promise<void>;
}

export default function EditRemarkModal({
  isOpen,
  onOpenChange,
  initialValue = "",
  onSubmit,
}: EditRemarkModalProps) {
  const t = useTranslations("cart");
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleConfirm = async () => {
    try {
      await onSubmit(value);
      onOpenChange(false);
    } catch (e) {
      // 错误处理交给外层或全局拦截
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("remarkTitle")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Textarea
        placeholder={t("remarkPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </CommonModal>
  );
}
