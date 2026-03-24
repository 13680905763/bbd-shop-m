"use client";

import { Avatar, Spinner } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import {
  useUpdateUserInfo,
  useUploadAvatar,
  useUserInfo,
} from "@/hook/business";
import { queryClient } from "@/lib/react-query";

export default function Settingpage() {
  const t = useTranslations("profile.profilePage");
  const router = useRouter();
  const { data: user, isLoading, error } = useUserInfo();
  const { updateUserInfo, isUpdating } = useUpdateUserInfo();
  const { uploadAvatar, isUploading } = useUploadAvatar();

  // --- 状态管理 ---
  const [formData, setFormData] = useState({
    id: "",
    nickName: "",
    mobile: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields: FieldConfig[] = [
    {
      type: "input",
      name: "nickName",
      key: "nickName",
      size: "md",
      label: t("nameLabel"),
    },
    {
      type: "input",
      name: "mobile",
      key: "mobile",
      size: "md",
      label: t("mobileLabel"),
    },
  ];

  // 点击头像触发文件选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 文件选择变化
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    try {
      await uploadAvatar(file);
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    } finally {
    }
  };

  useEffect(() => {
    if (user)
      setFormData({
        id: user?.id,
        nickName: user?.nickName || "",
        mobile: user?.mobile || "",
      });
  }, [user]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 px-2">
        <div className="box-card flex flex-col items-center justify-center p-2">
          <button
            className="relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <Spinner size="lg" />
            ) : (
              <>
                <Avatar
                  className="h-16 w-16 text-large"
                  src={user?.avatarUrl}
                />
                <span className="absolute bottom-0 left-0 rounded bg-black/50 px-1 text-xs text-white">
                  {t("edit")}
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
          <div className="text-lg font-bold">{user?.nickName}</div>
        </div>
        <CommonForm
          confirmText={t("saveButton")}
          fields={fields}
          formData={formData}
          isLoading={isUpdating}
          onChange={setFormData}
          onSubmit={updateUserInfo}
        />
      </div>
    </>
  );
}
