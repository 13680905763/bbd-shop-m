"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
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
  title = "操作确认",
  content = "确定要执行这个操作吗？",
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
}: ConfirmModalProps) => {
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
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{content}</p>
            </ModalBody>
            <ModalFooter className="flex gap-2">
              <Button
                className="button-default flex-1"
                disabled={loading}
                variant="light"
                onPress={onClose}
              >
                {cancelText}
              </Button>
              <Button
                className="flex-1"
                color="primary"
                isLoading={loading}
                onPress={() => handleConfirm(onClose)}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
