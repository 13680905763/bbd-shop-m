"use client";
import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { addToast } from "@heroui/react";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useChangePassword } from "@/hook/business";

export default function Settingpage() {
  const router = useRouter();
  const t = useTranslations("setting.changePassword");
  const { changePassword, isChanging } = useChangePassword();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const registerFormFields: FieldConfig[] = [
    {
      name: "oldPassword",
      key: "oldPassword",
      placeholder: t("form.oldPassword"),
      type: "password",
    },
    {
      name: "newPassword",
      key: "newPassword",
      placeholder: t("form.newPassword"),
      type: "password",
    },
    {
      name: "confirmPassword",
      key: "confirmPassword",
      placeholder: t("form.confirmPassword"),
      type: "password",
    },
  ];
  const handleSubmit = () => {
    // 校验两次密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: t("tip"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 p-2">
        <div className="overflow-hidden rounded-xl bg-white p-2 shadow-sm">
          <CommonForm
            confirmText={t("form.submit")}
            fields={registerFormFields}
            formData={formData}
            isLoading={isChanging}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
