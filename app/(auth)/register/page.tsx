"use client";

import { addToast, InputOtp } from "@heroui/react";
import React, { useState } from "react";
import { IoLockClosed, IoPeopleSharp, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { activateEmail, signUpCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { SignUpFormData } from "@/types";
import { handleAuthSuccess } from "@/lib/auth-handler";
const registerFormFields: FieldConfig[] = [
  {
    type: "input",
    name: "email",
    placeholder: "Enter your email",
    startContent: <IoPerson />,
  },
  {
    type: "input",
    name: "password",
    placeholder: "password",
    startContent: <IoLockClosed />,
  },
  {
    type: "input",
    name: "inviteCode",
    placeholder: "请输入邀请码，没有邀请码请留空",
    startContent: <IoPeopleSharp />,
  },
  {
    type: "checkbox",
    name: "agreeToTerms",
    label: "I have read and agree to the website terms and conditions",
    size: "sm",
  },
];

export default function RegisterPage() {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "177748@qq.com",
    password: "123",
    inviteCode: "",
    agreeToTerms: false,
  });
  const router = useRouter();

  const handleSubmit = async (formData: SignUpFormData) => {
    const { agreeToTerms, ...data } = formData;

    if (!agreeToTerms) {
      addToast({ title: "Please check the Unified Agreement", timeout: 1000 });

      return;
    }
    try {
      await signUpCustomer(data);
      setIsEmailVerified(true);
    } catch (e) {}
  };
  const handleInviteCode = async (e: any) => {
    if (e.length === 6) {
      // 激活
      try {
        const res = await activateEmail({
          email: formData.email,
          activationCode: e,
        });

        await handleAuthSuccess("/dashboard", res, router);
      } catch (err) {
        // 错误处理可选在这里写
      }
    }
  };

  return (
    <div>
      {!isEmailVerified ? (
        <>
          <CommonForm
            confirmText="注册"
            fields={registerFormFields}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
          <div className="my-4 text-sm">
            <span>Already have an account ? </span>
            <button
              className="text-[#f0700c]"
              onClick={() => router.push("/login")}
            >
              Go login
            </button>
          </div>
        </>
      ) : (
        <div>
          <p className="text-title-xl">验证你的电子邮箱（请勿离开此页面）</p>
          <div className="my-4 text-sm">
            <span>我们已经发送验证码到</span>
            <span className="font-bold">{formData.email}</span>
            <span>。请在下面输入验证码进行验证</span>
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
