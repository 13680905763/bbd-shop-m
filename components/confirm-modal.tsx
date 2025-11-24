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
import { useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  showCancel?: boolean; // ✅ 是否显示取消按钮
  showConfirm?: boolean; // ✅ 是否显示确认按钮
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  showCancel = true, // 默认显示
  showConfirm = true, // 默认显示
}: ConfirmModalProps) => {
  const t = useTranslations("components.confirmModal");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      hideCloseButton={true}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside" // ✅ 内容滚动
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title || t("title")}
            </ModalHeader>

            <ModalBody className="max-h-[60vh] overflow-y-auto">
              <p className="whitespace-pre-line break-words">
                {content || t("content")}
              </p>
            </ModalBody>

            {(showCancel || showConfirm) && (
              <ModalFooter className="flex gap-2">
                {showCancel && (
                  <Button
                    className="button-default flex-1"
                    disabled={loading}
                    variant="light"
                    onPress={onClose}
                  >
                    {cancelText || t("cancelText")}
                  </Button>
                )}

                {showConfirm && (
                  <Button
                    className="flex-1"
                    color="primary"
                    isLoading={loading}
                    onPress={() => handleConfirm()}
                  >
                    {confirmText || t("confirmText")}
                  </Button>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
