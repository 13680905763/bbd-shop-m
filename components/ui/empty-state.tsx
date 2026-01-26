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
      className={`flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-2 ${className}`}
    >
      <p className="text-lg ">{title}</p>
      <p className="text-sm ">{desc || t("desc")}</p>
    </div>
  );
}
