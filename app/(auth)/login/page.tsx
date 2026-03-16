"use client";
import React, { useState } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

import { LoginRequest } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useLoginFlow } from "@/hook/business";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { login: handleSubmit, isLoggingIn } = useLoginFlow();
  const [formData, setFormData] = useState<LoginRequest>({
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
  return (
    <CommonForm
      confirmText={t("loginButton")}
      fields={loginFormFields}
      formData={formData}
      onChange={setFormData}
      onSubmit={handleSubmit}
      isLoading={isLoggingIn}
    >
      <Button
        className="button-default"
        onPress={() => router.push("/register")}
      >
        {t("registerButton")}
      </Button>
      <div className="mt-4 text-center">
        <span
          role="button"
          className="cursor-pointer text-sm text-gray-500 hover:text-primary hover:underline"
          onClick={() => router.push("/forget-password")}
        >
          {t("forgetPassword") || "Forget Password?"}
        </span>
      </div>
    </CommonForm>
  );
}
