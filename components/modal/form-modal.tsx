import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import FormItemRenderer, { FieldConfig } from "../form/formItem-renderer";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const FormModal = ({
  title,
  isOpen,
  onOpenChange,
  fields,
  formData,
  onChange,
  onSave,
  confirmText = "保存",
  cancelText = "取消",
  loading = false,
}: FormModalProps) => {
  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <FormItemRenderer
                fields={fields}
                formData={formData}
                onChange={onChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                {cancelText}
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                onPress={() => {
                  onSave(formData);
                  onClose();
                }}
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

export default FormModal;
