// components/common/CommonModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface CommonModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCancel?: boolean;
  isDisabledConfirm?: boolean;
  onCancel?: () => void;
  onConfirm?: () => Promise<void> | void; // 不再传 onClose
  confirmText?: string;
  cancelText?: string;
  size?:
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}

export default function CommonModal({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  showCancel = true,
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
  isDisabledConfirm = false,
  size = "md",
  isDismissable = true,
  isKeyboardDismissDisabled = false,

}: CommonModalProps) {
  const t = useTranslations("components.confirmModal");

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    try {
      setLoading(true);
      await onConfirm(); // 异步操作
      onOpenChange(false); // 弹窗关闭
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return; // loading 时禁止关闭
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      placement="center"
      size={size}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          {title && <ModalHeader>{title}</ModalHeader>}
          <ModalBody className="max-h-[70vh] overflow-y-auto">
            {children}
          </ModalBody>
          <ModalFooter>
            {footer ? (
              footer
            ) : (
              <>
                {showCancel && (
                  <Button
                    isDisabled={loading}
                    variant="flat"
                    onPress={handleCancel}
                  >
                    {cancelText ?? t("cancelText")}
                  </Button>
                )}
                <Button
                  color="primary"
                  isDisabled={isDisabledConfirm}
                  isLoading={loading}
                  onPress={handleConfirm}
                >
                  {confirmText ?? t("confirmText")}
                </Button>
              </>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
