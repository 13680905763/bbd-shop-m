"use client";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FiSearch,
  FiShoppingCart,
  FiCreditCard,
  FiUsers,
  FiPackage,
  FiBox,
  FiTruck,
  FiGift,
} from "react-icons/fi";

type StepItem = {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export default function BeginnerGuide() {
  const router = useRouter();
  const t = useTranslations("helpGuide");

  const steps: StepItem[] = [
    {
      title: t("step1.title"),
      icon: <FiSearch />,
      content: (
        <>
          <p>{t("step1.content1")}</p>
          <p>{t("step1.content2")}</p>
          <p>{t("step1.content3")}</p>

          <div className="tip">{t("step1.tip")}</div>
        </>
      ),
    },
    {
      title: t("step2.title"),
      icon: <FiShoppingCart />,
      content: (
        <>
          <p>{t("step2.content1")}</p>
          <p>{t("step2.content2")}</p>
          <p>{t("step2.content3")}</p>
        </>
      ),
    },
    {
      title: t("step3.title"),
      icon: <FiCreditCard />,
      content: (
        <>
          <p>{t("step3.content1")}</p>
          <div className="tip">{t("step3.tip")}</div>
        </>
      ),
    },
    {
      title: t("step4.title"),
      icon: <FiUsers />,
      content: (
        <>
          <p>{t("step4.content1")}</p>
          <div className="tip">{t("step4.tip")}</div>
        </>
      ),
    },
    {
      title: t("step5.title"),
      icon: <FiPackage />,
      content: (
        <>
          <p>{t("step5.content1")}</p>
          <p>{t("step5.content2")}</p>
          <div className="tip">{t("step5.tip")}</div>
        </>
      ),
    },
    {
      title: t("step6.title"),
      icon: <FiBox />,
      content: (
        <>
          <p>{t("step6.content1")}</p>
          <div className="tip">{t("step6.tip")}</div>
        </>
      ),
    },
    {
      title: t("step7.title"),
      icon: <FiCreditCard />,
      content: (
        <>
          <p>{t("step7.content1")}</p>
          <div className="tip">{t("step7.tip")}</div>
        </>
      ),
    },
    {
      title: t("step8.title"),
      icon: <FiTruck />,
      content: (
        <>
          <p>{t("step8.content1")}</p>
          <div className="tip">{t("step8.tip")}</div>
        </>
      ),
    },
    {
      title: t("step9.title"),
      icon: <FiGift />,
      content: (
        <>
          <p>{t("step9.content1")}</p>
          <div className="tip">{t("step9.tip")}</div>
        </>
      ),
    },
  ];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-primary">
                <span className="text-lg">{step.icon}</span>
                <h2 className="font-medium">{step.title}</h2>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
