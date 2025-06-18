"use client";
import { Avatar } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hook/user/useUser";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";

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
  // {
  //   type: "select",
  //   name: "country",
  //   label: "国家",
  //   placeholder: "选择国家",
  //   options: [
  //     {
  //       label: "Argentina",
  //       value: "Argentina",
  //       icon: "https://flagcdn.com/ar.svg",
  //     },
  //     {
  //       label: "Venezuela",
  //       value: "Venezuela",
  //       icon: "https://flagcdn.com/ve.svg",
  //     },
  //     {
  //       label: "Brazil",
  //       value: "Brazil",
  //       icon: "https://flagcdn.com/ve.svg",
  //     },
  //     {
  //       label: "Switzerland",
  //       value: "Switzerland",
  //       icon: "https://flagcdn.com/ch.svg",
  //     },
  //   ],
  // },
];

export default function Settingpage() {
  const { data, isLoading, isError } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(data);
  }, [data]);
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        个人信息
      </NavBar>
      <div className="px-2">
        <div className="box-card flex flex-col items-center justify-center p-2">
          <Avatar className="h-[80px] w-[80px]" src={data.avatarUrl} />
          <div className="text-lg font-bold">{data.name}</div>
        </div>
        <div className="h-full bg-white p-2">
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
