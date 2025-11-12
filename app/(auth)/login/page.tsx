"use client";

import React, { useState } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { LoginFormData } from "@/types";
import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      key: "email",
      placeholder: t("emailPlaceholder"),
      startContent: <IoPerson />,
    },
    {
      type: "input",
      name: "password",
      key: "password",
      placeholder: t("passwordPlaceholder"),
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
        cancelText={t("registerButton")}
        confirmText={t("loginButton")}
        fields={loginFormFields}
        formData={formData}
        onCancel={() => router.push("/register")}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
