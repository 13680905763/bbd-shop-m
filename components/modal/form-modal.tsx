// 暂时用于地址跟账单地址表单

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "../form/formItem-renderer";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: (
    data: Record<string, any>,
  ) => Promise<boolean | void> | boolean | void;
  confirmText?: string;
  cancelText?: string;
}

const FormModal = ({
  title,
  isOpen,
  onOpenChange,
  fields,
  formData,
  onChange,
  onSubmit,
  confirmText,
  cancelText,
}: FormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("components.modal");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit?.(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      placement="top-center"
      scrollBehavior="normal"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="">
        <>
          <Form className="min-h-[300px] w-full" onSubmit={handleSubmit}>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody className="w-full">
              {/* <div
                className="h-full space-y-4 overflow-y-auto"
                // 明确告诉 iOS 这是主滚动容器
                style={{
                  WebkitOverflowScrolling: "touch",
                  // 创建独立的滚动上下文
                  transform: "translateZ(0)",
                }}
              > */}
              <FormItemRenderer
                fields={fields}
                formData={formData}
                onChange={onChange}
              />
              {/* </div> */}
            </ModalBody>
            <ModalFooter className="w-full">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={() => onOpenChange(false)}
              >
                {cancelText ?? t("cancel")}
              </Button>
              <Button color="primary" isLoading={isLoading} type="submit">
                {confirmText ?? t("confirm")}
              </Button>
            </ModalFooter>
          </Form>
        </>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
