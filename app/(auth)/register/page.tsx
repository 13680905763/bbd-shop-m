"use client";
import type { SignUpFormData } from "@/types";

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

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useSignUpFlow } from "@/hook/business";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    isEmailVerified,
    registeredEmail,
    setIsEmailVerified,
    signUp,
    isSigningUp,
    activateEmail,
    isActivating,
  } = useSignUpFlow();

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
  const handleSubmit = (formData: SignUpFormData) => {
    if (!formData.agreeToTerms) {
      addToast({
        title: t("mustAgree"),
        color: "warning",
      });

      return;
    }
    const submitData: any = {
      email: formData.email,
      password: formData.password,
    };

    if (formData.inviteCode) {
      submitData.inviteCode = formData.inviteCode;
    }

    signUp(submitData);
  };
  const handleInviteCode = (code: string) => {
    if (code.length === 6) {
      activateEmail({
        email: registeredEmail || formData.email,
        activationCode: code,
      });
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
            isLoading={isSigningUp}
            onChange={setFormData}
            onSubmit={() => handleSubmit(formData)}
          />
          <div className="mt-2 text-center text-sm">
            <span>{t("loginHint")}</span>
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
            {t("otpDescription", { email: registeredEmail || formData.email })}
          </div>
          <InputOtp
            className="m-auto"
            isDisabled={isActivating}
            length={6}
            size="lg"
            onValueChange={handleInviteCode}
          />
        </div>
      )}
    </div>
  );
}
