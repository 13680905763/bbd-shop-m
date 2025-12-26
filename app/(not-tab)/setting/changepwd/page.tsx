"use client";
import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { useTranslation } from "react-i18next";

import CommonForm from "@/components/form/common-form";
import { updatePwd } from "@/services";

export default function Settingpage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const registerFormFields = [
    {
      name: "oldPassword",
      key: "oldPassword",
      placeholder: t("setting.changePassword.form.oldPassword"),
      type: "input",
    },
    {
      name: "newPassword",
      key: "newPassword",
      placeholder: t("setting.changePassword.form.newPassword"),
      type: "input",
    },
    {
      name: "confirmPassword",
      key: "confirmPassword",
      placeholder: t("setting.changePassword.form.confirmPassword"),
      type: "input",
    },
  ];
  const handleSubmit = async () => {
    // 校验两次密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: t("setting.changePassword.tip", "两次输入的新密码不一致"),
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
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">
          {t("setting.changePassword.navBar.title")}
        </span>
      </NavBar>

      <div className="flex-1 bg-[#f5f5f5] p-4">
        <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm">
          <CommonForm
            confirmText={t("setting.changePassword.form.submit")}
            fields={registerFormFields as any}
            formData={formData}
            showCancelButton={false}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
