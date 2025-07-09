"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

import { LoginFormData } from "@/types";
import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { handleAuthSuccess } from "@/lib/auth-handler";
const loginFormFields: FieldConfig[] = [
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
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const redirect = searchParams.get("redirect") || "/"; // 默认为首页
  const handleSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginCustomer(data);

      await handleAuthSuccess(redirect, res, router);
    } catch (err) {
      // 错误处理可选在这里写
    }
  };

  return (
    <div>
      <CommonForm
        confirmText="登录"
        fields={loginFormFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      >
        <Button
          className="button-default"
          onPress={() => router.push("/register")}
        >
          注册
        </Button>
      </CommonForm>
    </div>
  );
}
