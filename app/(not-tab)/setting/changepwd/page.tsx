"use client";
import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
const registerFormFields: FieldConfig[] = [
  {
    name: "pwd1",
    placeholder: "旧密码",
    type: "input",
  },
  {
    name: "pwd2",
    placeholder: "新密码",
    type: "input",
  },
  {
    name: "pwd3",
    placeholder: "确认密码",
    type: "input",
  },
];

interface LoginFormData {
  pwd1: string;
  pwd2: string;
  pwd3: string;
}
export default function Settingpage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    pwd1: "",
    pwd2: "",
    pwd3: "",
  });

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        修改密码
      </NavBar>
      <div className="m-2">
        <CommonForm
          confirmText="修改密码"
          fields={registerFormFields}
          formData={formData}
          onChange={setFormData}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}
