"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import NextLink from "next/link";

import { Logo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-4">
      <div className="my-4">
        <NextLink href="/">
          <IoChevronBack className="w-[30px] h-[30px] text-[#f0700c]" />
        </NextLink>
      </div>
      <div className="mt-[100px]">
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
