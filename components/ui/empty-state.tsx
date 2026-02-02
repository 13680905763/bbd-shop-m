import { useTranslations } from "next-intl";
import React from "react";

interface EmptyStateProps {
  title?: string;
  desc?: string;
  className?: string;
}

export default function EmptyState({
  title,
  desc,
  className = "",
}: EmptyStateProps) {
  const t = useTranslations("components.ui.empty");

  return (
    <div
      className={`flex h-[60vh] flex-col items-center justify-center space-y-2 text-gray-500 ${className}`}
    >
      <p className="text-lg">{title}</p>
      <p className="text-sm">{desc || t("desc")}</p>
    </div>
  );
}
