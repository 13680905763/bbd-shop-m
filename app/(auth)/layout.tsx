"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Divider } from "@heroui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { Logo } from "@/components/icons";
import { loginWithGoogle } from "@/services";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // 默认为首页
  const handleLoginWithGoogle = async (
    credentialResponse: CredentialResponse,
  ) => {
    const credential = credentialResponse.credential;

    try {
      const res = await loginWithGoogle(credential as string);

      router.push(redirect);
    } catch (err) {
      // 同样的错误处理
    }
  };

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
      <GoogleLogin onSuccess={handleLoginWithGoogle} />
    </div>
  );
}
