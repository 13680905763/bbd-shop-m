"use client";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";



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
