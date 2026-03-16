"use client";
import React, { useState } from "react";
import { IoMail } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { userApi } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

export default function ForgetPasswordPage() {
  const t = useTranslations("auth.forgetPassword");
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: () => userApi.resetPassword({ email: formData.email, verificationCode: formData.code }),
    onSuccess: (res) => {
      addToast({
        title: res || "Password reset successful",
        color: "success",
      });
      router.push("/login");
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Operation failed",
        color: "danger",
      });
    },
  });

  const handleSendCode = async () => {
    if (!formData.email) {
      addToast({ title: t("emailError"), color: "danger" });
      throw new Error("Email required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast({ title: t("emailInvalid"), color: "danger" });
      throw new Error("Invalid email");
    }

    try {
      await userApi.sendVerificationCode(formData.email);
      addToast({ title: t("sendCodeSuccess"), color: "success" });
    } catch (error: any) {
      addToast({ title: error?.message || "Failed to send code", color: "danger" });
      throw error;
    }
  };

  const formFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      required: true,
      errorMessage: t("fields.email.errorMessage"),
      placeholder: t("fields.email.placeholder"),
      startContent: <IoMail />,
    },
    {
      type: "verificationCode",
      name: "code",
      required: true,
      placeholder: t("fields.code.placeholder"),
      config: {
        onSendCode: handleSendCode,
        sendCodeText: t("sendCode"),
        isSendDisabled: !formData.email,
      },
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-2">
          {t("desc")}
        </p>
      </div>
      <CommonForm
        confirmText={t("submit")}
        fields={formFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={() => handleSubmit()}
        isLoading={isPending}
      >
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">{t("hasAccount")} </span>
          <span
            role="button"
            className="cursor-pointer text-sm text-[#f0700c] hover:underline"
            onClick={() => router.push("/login")}
          >
            {t("login")}
          </span>
        </div>
      </CommonForm>
    </div>
  );
}
