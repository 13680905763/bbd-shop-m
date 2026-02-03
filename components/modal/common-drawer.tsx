import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";

interface CommonDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCancel?: boolean;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  height?: string | number;
}

export default function CommonDrawer({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  showCancel = false,
  onConfirm,
  confirmText,
  height = "80vh",
}: CommonDrawerProps) {
  const t = useTranslations("components.confirmModal");

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      size="xl"
      classNames={{
        base: "max-h-[85vh] rounded-t-xl",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {title && (
              <DrawerHeader className="flex flex-col gap-1 border-b border-gray-100 py-3 text-center">
                {title}
              </DrawerHeader>
            )}
            <DrawerBody className="scrollbar-hide overflow-y-auto p-4">
              {children}
            </DrawerBody>
            <DrawerFooter className="border-t border-gray-100 p-4">
              {footer ? (
                footer
              ) : (
                <Button
                  className="w-full font-medium"
                  color="primary"
                  size="lg"
                  onPress={() => {
                    if (onConfirm) {
                      onConfirm();
                    } else {
                      onClose();
                    }
                  }}
                >
                  {confirmText || t("confirmText")}
                </Button>
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
