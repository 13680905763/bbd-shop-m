// components/common/CommonModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import React from "react";

interface CommonModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  footer?: React.ReactNode;
  showCancel?: boolean;
  onCancel?: () => void;
  onConfirm?: (onClose: () => void) => void;
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
}

export default function CommonModal({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  showCancel = true,
  onCancel,
  showFooter = true,
  onConfirm,
  confirmText = "确认",
  cancelText = "取消",
  size = "md",
}: CommonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      size={size}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {title && <ModalHeader>{title}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            {showFooter && (
              <ModalFooter>
                {footer ? (
                  footer
                ) : (
                  <>
                    {showCancel && (
                      <Button
                        className="button-default"
                        variant="flat"
                        onPress={() => {
                          onCancel?.();
                          onClose();
                        }}
                      >
                        {cancelText}
                      </Button>
                    )}
                    <Button
                      color="primary"
                      onPress={() => {
                        onConfirm?.(onClose);
                      }}
                    >
                      {confirmText}
                    </Button>
                  </>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
