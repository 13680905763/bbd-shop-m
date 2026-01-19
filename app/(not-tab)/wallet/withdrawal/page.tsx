"use client";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";

// const registerFormFields: FieldConfig[] = [
//   {
//     name: "pwd1",
//     placeholder: "收款人",
//     type: "input",
//   },
//   {
//     name: "pwd2",
//     placeholder: "国家",
//     type: "select",
//     options: [
//       {
//         label: "中国银行",
//         value: "Argentina",
//         // src: "https://flagcdn.com/ar.svg",
//       },
//       {
//         label: "建设银行",
//         value: "Venezuela",
//         // src: "https://flagcdn.com/ve.svg",
//       },
//       {
//         label: "paypal",
//         value: "Brazil",
//         // src: "https://flagcdn.com/ve.svg",
//       },
//     ],
//   },

//   {
//     name: "pwd3",
//     placeholder: "银行卡",
//     type: "input",
//   },
//   {
//     name: "pwd4",
//     placeholder: "提现金额",
//     type: "input",
//   },
// ];

interface LoginFormData {
  pwd1: string;
  pwd2: string;
  pwd3: string;
}
export default function Settingpage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        提现
      </NavBar>
    </div>
  );
}
