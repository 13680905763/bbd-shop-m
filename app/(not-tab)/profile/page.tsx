"use client";

import { Avatar, Spinner } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CommonForm from "@/components/form/common-form";
import { useUserStore } from "@/store";
import { getUserInfo, updateUserInfo, uploadAvatar } from "@/services"; // ✅ uploadAvatar 是上传接口

export default function Settingpage() {
  const t = useTranslations("Profile.Page");

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // 文件输入引用
  const [formData, setFormData] = useState({
    id: user?.id,
    name: user?.name || "",
    familyName: user?.familyName || "",
    givenName: user?.givenName || "",
    mobile: user?.mobile || "",
  });

  const handleSubmit = async (data: any) => {
    try {
      await updateUserInfo(data);
    } finally {
      const updatedUser = await getUserInfo();

      useUserStore.getState().setUser(updatedUser);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        id: user?.id,
        name: user?.name || "",
        familyName: user?.familyName || "",
        givenName: user?.givenName || "",
        mobile: user?.mobile || "",
      });
    }
  }, [user]);

  // 点击头像触发文件选择
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 文件选择变化
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarLoading(true);
    try {
      // 这里需要你实现 uploadAvatar 接口：把 file 上传到后端并返回新的头像地址
      await uploadAvatar(file);

      // // 更新用户信息
      // await updateUserInfo({ ...formData, avatarUrl: url });
      const user = await getUserInfo();

      useUserStore.getState().setUser(user);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>
      <div className="px-2">
        <div className="box-card flex flex-col items-center justify-center p-2">
          <button
            className="relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatarLoading ? (
              <Spinner size="lg" />
            ) : (
              <Avatar className="h-16 w-16 text-large" src={user?.avatarUrl} />
            )}
            <span className="absolute bottom-0 left-0 rounded bg-black/50 px-1 text-xs text-white">
              edit
            </span>
          </button>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
          <div className="text-lg font-bold">{user?.name}</div>
        </div>
        <div className="h-full p-2">
          <CommonForm
            fields={t.raw("fields")}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
