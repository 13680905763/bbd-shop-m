"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState, ReactNode, useCallback } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: ReactNode;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<unknown>;
  showCancel?: boolean; // ✅ 是否显示取消按钮
  showConfirm?: boolean; // ✅ 是否显示确认按钮
  // 新增：是否在成功后自动关闭
  closeOnSuccess?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onOpenChange,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  showCancel = true,
  showConfirm = true,
  closeOnSuccess = true,
}: ConfirmModalProps) {
  const t = useTranslations("components.confirmModal");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      if (closeOnSuccess) {
        onOpenChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm, closeOnSuccess, onOpenChange]);
  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Modal
      hideCloseButton={true}
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside" // ✅ 内容滚动
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {title || t("title")}
        </ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          <p className="whitespace-pre-line break-words">
            {content || t("content")}
          </p>
        </ModalBody>
        {(showCancel || showConfirm) && (
          <ModalFooter>
            {showCancel && (
              <Button
                aria-label={cancelText || t("cancelText")}
                className="button-default flex-1"
                disabled={isLoading}
                variant="light"
                onPress={handleCancel}
              >
                {cancelText || t("cancelText")}
              </Button>
            )}
            {showConfirm && (
              <Button
                aria-label={confirmText || t("confirmText")}
                className="flex-1"
                color="primary"
                disabled={isLoading}
                isLoading={isLoading}
                onPress={handleConfirm}
              >
                {!isLoading && (confirmText || t("confirmText"))}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
