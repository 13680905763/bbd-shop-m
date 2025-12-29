"use client";

import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function CopyButton({ 
  text, 
  size = 14, 
  className = "",
  color = "text-gray-400"
}: CopyButtonProps) {
  const t = useTranslations("components.copyButton");

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: t("success"),
        timeout: 1500,
        color: "success",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers or if navigator.clipboard fails
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        addToast({
          title: t("success"),
          timeout: 1500,
          color: "success",
        });
      } catch (err) {
        addToast({
          title: t("fail"),
          timeout: 1500,
          color: "danger",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      className={`ml-1 hover:opacity-70 active:scale-95 transition-all ${className} `}
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      title={t("title")}
    >
      <FaCopy size={size} className={color} />
    </button>
  );
}
