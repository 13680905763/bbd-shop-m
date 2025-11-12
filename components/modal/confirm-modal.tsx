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
  onConfirm: (onClose: () => void) => void | Promise<void>;
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
}: ConfirmModalProps) => {
  const t = useTranslations("components.confirmModal");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (onClose: () => void) => {
    setLoading(true);
    try {
      await onConfirm(onClose);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title || t("title")}
            </ModalHeader>

            <ModalBody>
              <p>{content || t("content")}</p>
            </ModalBody>

            <ModalFooter className="flex gap-2">
              <Button
                className="button-default flex-1"
                disabled={loading}
                variant="light"
                onPress={onClose}
              >
                {cancelText || t("cancelText")}
              </Button>

              <Button
                className="flex-1"
                color="primary"
                isLoading={loading}
                onPress={() => handleConfirm(onClose)}
              >
                {confirmText || t("confirmText")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
