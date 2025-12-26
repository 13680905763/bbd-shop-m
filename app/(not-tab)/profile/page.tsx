"use client";

import { Avatar, Spinner } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import CommonForm from "@/components/form/common-form";
import { getUserInfo, updateUserInfo, uploadAvatar } from "@/services"; // ✅ uploadAvatar 是上传接口
import { FieldConfig } from "@/components/form/formItem-renderer";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Settingpage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.profilePage",
  });
  const router = useRouter();

  // --- 状态管理 ---
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: "",
    nickName: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 获取用户信息
  const fetchUser = async () => {
    try {
      const res = await getUserInfo();

      setUser(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
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

  const handleSubmit = async (data: any) => {
    await updateUserInfo(data);
    // 更新最新用户信息
    await fetchUser();
  };

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
      await uploadAvatar(file);
      await fetchUser();
    } finally {
      setAvatarLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      id: user?.id,
      nickName: user?.nickName || "",
      mobile: user?.mobile || "",
    });
  }, [user]);

  // if (loading) return <FullscreenLoader />;

  return (
    <>
      {loading && <FullscreenLoader />}

      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>
      <div className="flex-1 bg-[#f5f5f5] p-2">
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
              {t("edit")}
            </span>
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
          showCancelButton={false}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
