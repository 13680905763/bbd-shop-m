"use client";

import { addToast, InputOtp } from "@heroui/react";
import React, { useState } from "react";
import {
  IoArrowBack,
  IoLockClosed,
  IoPeopleSharp,
  IoPerson,
} from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { activateEmail, signUpCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { SignUpFormData } from "@/types";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    inviteCode: searchParams.get("inviteCode") || "",
    agreeToTerms: false,
  });
  const registerFormFields: FieldConfig[] = [
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
    {
      type: "input",
      name: "inviteCode",
      key: "inviteCode",
      placeholder: t("fields.inviteCode.placeholder"),
      startContent: <IoPeopleSharp />,
      isDisabled: searchParams.get("inviteCode") ? true : false,
    },
    {
      type: "checkbox",
      key: "agreeToTerms",
      name: "agreeToTerms",
      label: t("fields.isChecked.label"),
      size: "sm",
    },
  ];
  const handleSubmit = async (formData: SignUpFormData) => {
    const { agreeToTerms, ...data } = formData;

    if (!agreeToTerms) {
      addToast({ title: t("mustAgree"), timeout: 1500 });

      return;
    }
    try {
      await signUpCustomer(data);
      setIsEmailVerified(true);
    } catch { }
  };
  const handleInviteCode = async (code: string) => {
    if (code.length === 6) {
      try {
        await activateEmail({
          email: formData.email,
          activationCode: code,
        });
        router.push("/dashboard");
      } catch { }
    }
  };

  return (
    <div>
      {!isEmailVerified ? (
        <>
          <CommonForm
            confirmText={t("registerButton")}
            fields={registerFormFields}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
          <div className="mt-2 text-center text-sm">
            <span>{t("loginHint")} </span>
            <button
              className="text-[#f0700c]"
              onClick={() => router.push("/login")}
            >
              {t("goLogin")}
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
            <p className="font-semibold">{t("verifyTitle")}</p>
          </div>
          <div className="my-4 text-sm">
            {t("otpDescription", { email: formData.email })}
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
