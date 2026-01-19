"use client";

import React, { ReactNode } from "react";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";

interface CopyTextProps {
  text: string;
  children: ReactNode;
  toastMessage?: string;
  className?: string;
}

export default function CopyText({
  text,
  children,
  toastMessage = "",
  className = "",
}: CopyTextProps) {
  const  t  = useTranslations("components.ui.copy");

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡触发父级点击事件
    
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: toastMessage || t("success"),
        color: "success",
        timeout: 1500,
      });
    } catch (error) {
      console.error("Copy failed:", error);
      addToast({
        title: t("fail"),
        color: "danger",
        timeout: 1500,
      });
    }
  };

  return (
    <div 
      className={`cursor-pointer ${className}`} 
      onClick={handleCopy}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
