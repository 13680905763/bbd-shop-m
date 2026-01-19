"use client";
import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { addToast } from "@heroui/react";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { updatePwd } from "@/services";

export default function Settingpage() {
  const router = useRouter();
  const t = useTranslations("setting.changePassword");

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
      type: "input",
    },
    {
      name: "newPassword",
      key: "newPassword",
      placeholder: t("form.newPassword"),
      type: "input",
    },
    {
      name: "confirmPassword",
      key: "confirmPassword",
      placeholder: t("form.confirmPassword"),
      type: "input",
    },
  ];
  const handleSubmit = async () => {
    // 校验两次密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: "两次输入的新密码不一致",
        timeout: 1000,
        color: "danger",
      });

      return false;
    }
    try {
      await updatePwd({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);

      return true;
    } catch {
      // 可以加 toast 提示
    }
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
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
