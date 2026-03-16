"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import PointsRecordContent from "./points-record-content";
import PointsChangeContent from "./points-change-content";

import { CommonTabs } from "@/components/common";
import { useUserInfo } from "@/hook/business";

export default function PointsPage() {
  const t = useTranslations("wallet.points");
  const router = useRouter();
  const { data: user } = useUserInfo();
  const tabs = [
    {
      key: "detail",
      title: t("tabs.detail"),
      content: <PointsRecordContent />,
    },
    {
      key: "change",
      title: t("tabs.change"),
      content: <PointsChangeContent />,
    },
  ];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="m-2 flex items-center gap-2 rounded-lg bg-[#ffeee1] p-6">
        <IoWallet className="h-5 w-5 text-[#f0700c]" />
        <span>{t("myPoints")}</span>
        <span className="text-balance">{user?.myPoints}</span>
      </div>
      <CommonTabs tabs={tabs} />
    </>
  );
}
