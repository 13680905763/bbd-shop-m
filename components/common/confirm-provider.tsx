"use client";

import React, {
  createContext,
  useContext,
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
  type?: "default" | "danger" | "warning"; // 增加类型支持
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  showCancel?: boolean; // 新增控制是否显示取消按钮的选项
  showConfirm?: boolean; // 新增控制是否显示确认按钮的选项
  isLoading?: boolean; // 外部控制 loading
}

// 2. 定义 Context
interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  close: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// 3. Provider 组件
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("components.common.confirmModal");

  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  // 使用 ref 存储 resolve 函数，以便在 confirm 中调用
  const resolveRef = useRef<(value: boolean) => void>(() => { });

  const confirm = useCallback((opts: ConfirmOptions) => {
    opts.showCancel = opts.showCancel ?? true;
    opts.showConfirm = opts.showConfirm ?? true;
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    setLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      // 如果提供了 onConfirm，处理异步逻辑
      try {
        setLoading(true);
        await options.onConfirm();
      } catch (error) {
        console.error("Confirm action failed:", error);

        return; // 出错时不关闭弹窗
      } finally {
        setLoading(false);
      }
    }

    resolveRef.current(true);
    close();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    resolveRef.current(false);
    close();
  };

  const getButtonColor = (type?: string) => {
    switch (type) {
      case "danger":
        return "danger";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, close }}>
      {children}
      {options && (
        <Modal
          hideCloseButton={loading}
          isDismissable={false}
          isOpen={isOpen}
          placement="center"
          onOpenChange={(open) => !open && handleCancel()}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {options.title || t("title")}
                </ModalHeader>
                <ModalBody>
                  <div
                    className={options.type === "danger" ? "text-danger" : ""}
                  >
                    {options.content}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    isDisabled={loading || options.isLoading}
                    variant="light"
                    onPress={handleCancel}
                  >
                    {options.cancelText || t("cancel")}
                  </Button>
                  {
                    options.showConfirm && (
                      <Button
                        color={getButtonColor(options.type)}
                        isLoading={loading || options.isLoading}
                        onPress={handleConfirm}
                      >
                        {options.confirmText || t("confirm")}
                      </Button>
                    )
                  }
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
};

// 4. 自定义 Hook
export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }

  return context;
};
