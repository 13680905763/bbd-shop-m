import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
// import { useVisualViewport } from "@/hook/common";

interface CommonDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  height?: string | number;
  isDisabled?: boolean;
}

export default function CommonDrawer({
  isOpen,
  onOpenChange,
  title,
  children,
  onConfirm,
  confirmText,
  isDisabled = false,
}: CommonDrawerProps) {
  const t = useTranslations("components.confirmModal");
  const [isLoading, setIsLoading] = useState(false);
  // useVisualViewport();

  return (
    <Drawer
      classNames={{
        base: "max-h-[85vh] rounded-t-xl",
      }}
      isDismissable={!isLoading}
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {title && (
              <DrawerHeader className="flex flex-col gap-1 border-b border-gray-100 py-3 text-center">
                {title}
              </DrawerHeader>
            )}
            <DrawerBody className="overflow-y-auto p-4 scrollbar-hide w-full">
              {children}
            </DrawerBody>
            <DrawerFooter className="border-t border-gray-100 p-4">
              <Button
                className="w-full font-medium"
                color="primary"
                isLoading={isLoading}
                isDisabled={isDisabled}
                onPress={async () => {
                  try {
                    setIsLoading(true);
                    if (onConfirm) {
                      await onConfirm();
                    } else {
                      onClose();
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {confirmText || t("confirmText")}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
