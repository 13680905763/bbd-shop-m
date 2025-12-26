"use client";
import { IoChevronBack } from "react-icons/io5";
import React from "react";
import { useRouter } from "next/navigation";
import { Divider } from "@heroui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

import { loginWithGoogle } from "@/services";
import { Logo } from "@/components/icons";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("translation", { keyPrefix: "auth" });

  const router = useRouter();
  const handleLoginWithGoogle = async (
    credentialResponse: CredentialResponse,
  ) => {
    const credential = credentialResponse.credential;

    try {
      const res = await loginWithGoogle(credential as string);

      router.push("/");
    } catch {}
  };

  return (
    <div className="bgimg min-h-[100vh] p-2 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
      <button onClick={() => router.back()}>
        <IoChevronBack className="h-[30px] w-[30px] text-[#f0700c]" />
      </button>
      <div className="pt-16">
        <Logo width={170} />
        <div className="my-5">
          <p className="text-lg font-bold">{t("sloganTitle")}</p>
          <p className="">{t("sloganDesc")}</p>
        </div>
        {children}
      </div>
      <Divider className="my-8" />
      <GoogleLogin onSuccess={handleLoginWithGoogle} />
    </div>
  );
}
