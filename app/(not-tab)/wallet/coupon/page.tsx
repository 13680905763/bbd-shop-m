"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { CommonTabs } from "@/components/common";
import { useUserCoupon } from "@/hook/api";
import { Coupon } from "@/types/wallet";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { CouponItem } from "@/components/item-list";
import CouponRedemption from "./coupon-redemption";

const tabKeyToStatusCode: Record<string, string> = {
  unused: "1", // 可用
  used: "2", // 已使用
  expired: "3", // 过期
};

export default function CouponPage() {
  const t = useTranslations("dashboard.coupon");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("unused");

  const { data, isFetching, } = useUserCoupon({
    status: tabKeyToStatusCode[activeTab],
  });

  const renderCouponContent = () => {
    if (!data?.length && !isFetching) return <EmptyState />;
    return (
      <>
        {isFetching && <BlockSpinner />}
        <div className="grid grid-cols-1 gap-2">
          {data?.map((coupon: Coupon) => (
            <CouponItem key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </>
    );
  };
  const tabs = [
    {
      key: "unused",
      title: t("tabs.unused"),
      content: renderCouponContent(),
    },
    {
      key: "used",
      title: t("tabs.used"),
      content: renderCouponContent(),
    },
    {
      key: "expired",
      title: t("tabs.expired"),
      content: renderCouponContent(),
    },
  ];
  return (
    <>
      <NavBar className="bg-white shrink-0" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <CouponRedemption />
      <CommonTabs
        defaultSelectedKey="unused"
        tabs={tabs}
        onSelectionChange={(key) => setActiveTab(String(key))}
      />
    </>
  );
}
