"use client";

import { addToast, InputOtp } from "@heroui/react";
import React, { useState } from "react";
import {
  IoArrowBack,
  IoLockClosed,
  IoPeopleSharp,
  IoPerson,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { activateEmail, signUpCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { SignUpFormData } from "@/types";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    inviteCode: "",
    agreeToTerms: false,
  });
  // 表单字段配置（动态国际化）
  const registerFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      key: "email",
      required: true,
      placeholder: t("auth.register.emailPlaceholder"),
      startContent: <IoPerson />,
    },
    {
      type: "input",
      name: "password",
      key: "password",
      required: true,
      placeholder: t("auth.register.passwordPlaceholder"),
      startContent: <IoLockClosed />,
    },
    {
      type: "input",
      name: "inviteCode",
      key: "inviteCode",
      placeholder: t("auth.register.inviteCodePlaceholder"),
      startContent: <IoPeopleSharp />,
    },
    {
      type: "checkbox",
      key: "agreeToTerms",
      name: "agreeToTerms",
      label: t("auth.register.agreeToTerms"),
      size: "sm",
    },
  ];

  const handleSubmit = async (formData: SignUpFormData) => {
    const { agreeToTerms, ...data } = formData;

    if (!agreeToTerms) {
      addToast({ title: t("auth.register.mustAgree"), timeout: 1500 });

      return;
    }
    try {
      await signUpCustomer(data);
      setIsEmailVerified(true);
    } catch {}
  };
  const handleInviteCode = async (code: string) => {
    if (code.length === 6) {
      try {
        await activateEmail({
          email: formData.email,
          activationCode: code,
        });
        router.push("/dashboard");
      } catch {}
    }
  };

  return (
    <div>
      {!isEmailVerified ? (
        <>
          <CommonForm
            confirmText={t("auth.register.registerButton")}
            fields={registerFormFields}
            formData={formData}
            showCancelButton={false}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
          <div className="my-4 text-center text-sm">
            <span>{t("auth.register.loginHint")} </span>
            <button
              className="text-[#f0700c] hover:underline"
              onClick={() => router.push("/login")}
            >
              {t("auth.register.goLogin")}
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-center gap-2">
            <IoArrowBack
              className="cursor-pointer text-lg"
              onClick={() => setIsEmailVerified(false)}
            />
            <p className="text-xl font-semibold">
              {t("auth.register.verifyTitle")}
            </p>
          </div>
          <div className="my-4 text-sm">
            <span>{t("auth.register.verifyInstruction1")} </span>
            <span className="font-bold">{formData.email}</span>
            <span>{t("auth.register.verifyInstruction2")}</span>
          </div>
          <InputOtp
            className="m-auto"
            length={6}
            size="lg"
            onValueChange={handleInviteCode}
          />
        </div>
      )}
    </div>
  );
}
