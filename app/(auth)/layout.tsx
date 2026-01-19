"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Divider, Button } from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";

import { Logo } from "@/components/icons";
import { loginWithGoogleNew } from "@/services";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // 默认为首页

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "email profile openid",
    onSuccess: async (codeResponse) => {
      try {
        await loginWithGoogleNew({ authorizationCode: codeResponse.code, inviteCode: searchParams.get("inviteCode") || "", });
        router.push(redirect);
      } catch { }
    },
  });

  return (
    <div className="bg h-[100dvh] p-2">
      <button onClick={() => router.back()}>
        <IoChevronBack className="h-[30px] w-[30px] text-[#f0700c]" />
      </button>
      <div className="pt-16">
        <Logo width={170} />
        <div className="my-[20px]">
          <p className="font-bold">{t("sloganTitle")}</p>
          <p className="text-xs">{t("sloganDesc")}</p>
        </div>
        {children}
      </div>
      <Divider className="my-8" />
      <div className="flex justify-center">
        <Button
          className="w-full border border-gray-300 bg-white font-semibold"
          startContent={<FaGoogle />}
          onPress={() => handleGoogleLogin()}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
