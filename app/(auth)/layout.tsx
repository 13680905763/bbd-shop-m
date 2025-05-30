"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="p-2 h-[100dvh] bg">
      <button onClick={() => router.back()}>
        <IoChevronBack className="w-[30px] h-[30px] text-[#f0700c]" />
      </button>
      <div className="pt-16">
        <Logo width={170} />
        <div className="my-[20px]">
          <p className="font-bold">提供一站式服务</p>
          <p className="text-xs">轻松从中国购物，专业运输全球</p>
        </div>
        {children}
      </div>
    </div>
  );
}
