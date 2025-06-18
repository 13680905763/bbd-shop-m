// components/common/CustomModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  footer?: React.ReactNode;
  showCancel?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function CustomModal({
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
}: CustomModalProps) {
  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
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
                        onConfirm?.();
                        onClose();
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
