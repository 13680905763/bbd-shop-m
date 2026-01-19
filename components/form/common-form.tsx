import { Button, Form } from "@heroui/react";
import React, { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "./formItem-renderer";

interface CommonFormProps<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
  onSubmit?: (data: T) => void;
  confirmText?: string;
  children?: ReactNode; // ✅ 新增 children
  isLoading?: boolean;
}

export default function CommonForm<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
  onSubmit,
  confirmText,
  children,
}: CommonFormProps<T>) {
  const t = useTranslations("components.form");
  const [isLoading, setIsLoading] = useState(false);

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
    <Form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <FormItemRenderer
        fields={fields}
        formData={formData}
        onChange={onChange}
      />

      <div className="my-2 flex w-full flex-col gap-2">
        <Button color="primary" isLoading={isLoading} type="submit">
          {confirmText ?? t("save")}
        </Button>
        {children}
      </div>
    </Form>
  );
}
