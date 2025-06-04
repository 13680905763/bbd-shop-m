"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, Divider } from "@heroui/react";

import { Logo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="bg h-[100dvh] p-2">
      <button onClick={() => router.back()}>
        <IoChevronBack className="h-[30px] w-[30px] text-[#f0700c]" />
      </button>
      <div className="pt-16">
        <Logo width={170} />
        <div className="my-[20px]">
          <p className="font-bold">提供一站式服务</p>
          <p className="text-xs">轻松从中国购物，专业运输全球</p>
        </div>
        {children}
      </div>
      <Divider className="my-8" />
      <Button
        className="w-full"
        color="primary"
        type="submit"
        variant="bordered"
        // onPress={() => signIn("google")}
      >
        使用Google账号
      </Button>
    </div>
  );
}
