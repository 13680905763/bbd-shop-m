"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function OrderPromptCard() {
  const t = useTranslations("profile.order.promptCard");
  const router = useRouter();

  return (
    <div className="mb-2 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
      <div className="flex-1">
        <h3 className="mb-1 text-sm font-bold text-gray-900">
          {t("title")}
        </h3>
        <p className="line-clamp-1 text-xs text-gray-500">
          {t("description")}
        </p>
      </div>
      <Button
        className="ml-3 h-7 min-w-[70px] bg-[#f0700c] px-3 text-xs font-medium text-white"
        radius="full"
        size="sm"
        onPress={() => router.push("/profile/warehouse")}
      >
        {t("button")}
      </Button>
    </div>
  );
}
