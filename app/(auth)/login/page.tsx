"use client";

import React, { useState } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

import { LoginFormData } from "@/types";
import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      required: true,
      errorMessage: t("fields.email.errorMessage"),
      placeholder: t("fields.email.placeholder"),
      startContent: <IoPerson />,
    },
    {
      type: "password",
      name: "password",
      required: true,
      placeholder: t("fields.password.placeholder"),
      errorMessage: t("fields.password.errorMessage"),
      startContent: <IoLockClosed />,
    },
  ];
  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginCustomer(data);
      router.push("/dashboard");
    } catch {
      // 可以加 toast 提示
    }
  };

  return (
    <div>
      <CommonForm
        confirmText={t("loginButton")}
        fields={loginFormFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      >
        <Button
          className="button-default"
          onPress={() => router.push("/register")}
        >
          {t("registerButton")}
        </Button>
      </CommonForm>
    </div>
  );
}
