import { addToast, Button, Form } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "./formItem-renderer";

interface CommonFormProps<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
  onSubmit?: (data: T) => Promise<void> | void; // ✅ 支持异步
  onCancel?: () => Promise<void> | void; // ✅ 支持异步
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean; // 默认 true
}

export default function CommonForm<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
  onSubmit,
  onCancel,
  confirmText,
  cancelText,
  showCancelButton = true, // 默认 true
}: CommonFormProps<T>) {
  const t = useTranslations("components.form");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!onCancel) return;
    try {
      setLoading(true);
      await onCancel();
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ 提前阻止默认提交

    const missingFields = fields
      .filter((f) => f.required && !formData?.[f.name])
      .map((f) => f.label || f.name);

    if (missingFields.length > 0) {
      addToast({
        title: t("missingFieldsTitle", { fields: missingFields.join("、") }),

        timeout: 1000,
        color: "danger",
      });

      return;
    }
    if (!onSubmit) return;

    try {
      setLoading(true);
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <FormItemRenderer
        fields={fields}
        formData={formData}
        onChange={onChange}
      />

      <div className="my-2 flex w-full flex-col gap-2">
        <Button
          color="primary"
          isLoading={loading} // ✅ 内部 loading
          type="submit"
        >
          {confirmText || t("confirm")}
        </Button>
        {showCancelButton && ( // ✅ 根据 props 判断是否渲染
          <Button
            className="button-default"
            isDisabled={loading}
            onPress={handleCancel}
          >
            {cancelText ?? t("cancel")}
          </Button>
        )}
      </div>
    </Form>
  );
}
