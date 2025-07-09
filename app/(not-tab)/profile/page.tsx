"use client";

import { Avatar } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useUserStore } from "@/store";
import { UserInfo } from "@/types";

const profileFields: FieldConfig[] = [
  {
    type: "input",
    name: "name",
    label: "用户名",
  },
  {
    type: "input",
    name: "mobile",
    label: "手机号码",
  },
  { type: "date", name: "birthday", label: "生日" },
  {
    type: "input",
    name: "email",
    label: "电子邮件",
  },
];

export default function Settingpage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState<UserInfo | {}>(() =>
    user ? { ...user } : {},
  );

  useEffect(() => {
    if (user) {
      setFormData({ ...user }); // 浅拷贝避免直接修改 Zustand 状态
    }
  }, [user]);

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        个人信息
      </NavBar>
      <div className="px-2">
        <div className="box-card flex flex-col items-center justify-center p-2">
          <Avatar className="h-[80px] w-[80px]" src={user?.avatarUrl} />
          <div className="text-lg font-bold">{user?.name}</div>
        </div>
        <div className="h-full p-2">
          <CommonForm
            fields={profileFields}
            formData={formData}
            onChange={setFormData}
          />
        </div>
      </div>
    </div>
  );
}
