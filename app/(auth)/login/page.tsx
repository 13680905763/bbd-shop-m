"use client";

import React, { useState } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { LoginFormData } from "@/types";
import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "test@bbd.com",
    password: "123456",
  });
  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      key: "email",
      placeholder: t("auth.login.emailPlaceholder"),
      startContent: <IoPerson />,
    },
    {
      type: "password",
      name: "password",
      key: "password",
      placeholder: t("auth.login.passwordPlaceholder"),
      startContent: <IoLockClosed />,
    },
  ];
  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginCustomer(data);
      router.push("/");
    } catch {
      // 可以加 toast 提示
    }
  };

  return (
    <div>
      <CommonForm
        cancelText={t("auth.login.registerButton")}
        confirmText={t("auth.login.loginButton")}
        fields={loginFormFields}
        formData={formData}
        onCancel={() => router.push("/register")}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
