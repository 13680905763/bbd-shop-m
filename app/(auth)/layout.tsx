"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter } from "next/navigation";
import { addToast, Divider } from "@heroui/react";
import { GoogleLogin } from "@react-oauth/google";

import { Logo } from "@/components/icons";
import { getgoogle } from "@/services/api/auth";

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

      <GoogleLogin
        onError={() => {
          console.error("Google 登录失败");
        }}
        onSuccess={(credentialResponse) => {
          const credential = credentialResponse.credential;

          getgoogle(credential as string).then((e: any) => {
            console.log("谷歌登录成功", e);
            if (e.success) {
              addToast({
                title: e.msg,
                timeout: 1000,
                color: "success",
              });
              router.push("/");
            } else {
              addToast({
                title: e.msg,
                timeout: 1000,
                color: "danger",
              });
            }
          });
          // const payload: any = jwtDecode(credential!);

          console.log("Google 用户信息:", credential);

          // fetch('/api/auth/google', { method: 'POST', body: JSON.stringify(payload) })
        }}
      />
    </div>
  );
}
