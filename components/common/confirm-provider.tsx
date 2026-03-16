"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";

// 1. 定义确认框配置选项
export interface ConfirmOptions {
  title?: ReactNode;
  content: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  showCancel?: boolean; // 新增控制是否显示取消按钮的选项
  showConfirm?: boolean; // 新增控制是否显示确认按钮的选项
  isLoading?: boolean; // 外部控制 loading
  hideCloseButton?: boolean; // 新增控制是否隐藏关闭按钮的选项
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";  // 新增控制弹窗大小的选项
}

// 2. 定义 Context
interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  close: () => void;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(
  undefined,
);

// 3. Provider 组件
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("components.common.confirmModal");

  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  // 使用 ref 存储 resolve 函数，以便在 confirm 中调用
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const confirm = useCallback((opts: ConfirmOptions) => {
    const mergedOptions: ConfirmOptions = {
      showCancel: true,
      showConfirm: true,
      ...opts,
    };

    setOptions(mergedOptions);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);



  const close = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;

    setIsOpen(false);
    setOptions(null);
    setIsLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      // 如果提供了 onConfirm，处理异步逻辑
      try {
        setIsLoading(true);
        await Promise.resolve(options.onConfirm?.());
      } catch (error) {
        console.error("Confirm action failed:", error);
        return; // 出错时不关闭弹窗
      } finally {
        setIsLoading(false);
      }
    }
    resolveRef.current?.(true);
    close();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    resolveRef.current?.(false);
    close();
  };
  console.log('modal渲染');

  return (
    <ConfirmContext.Provider value={{ confirm, close }}>
      {children}
      {options && (
        <Modal
          hideCloseButton={options.hideCloseButton || isLoading || options.isLoading}
          isDismissable={false}
          isOpen={isOpen}
          placement="center"
          size={options.size || "md"}
          onOpenChange={(open) => !open && handleCancel()}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {options.title || t("title")}
            </ModalHeader>
            <ModalBody>{options.content}</ModalBody>
            <ModalFooter>
              {options.showCancel && (
                <Button
                  isDisabled={isLoading || options.isLoading}
                  variant="light"
                  onPress={handleCancel}
                >
                  {options.cancelText || t("cancel")}
                </Button>
              )}
              {options.showConfirm && (
                <Button
                  color="primary"
                  isLoading={isLoading || options.isLoading}
                  onPress={handleConfirm}
                >
                  {options.confirmText || t("confirm")}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};
