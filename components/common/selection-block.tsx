import React from "react";
import { Skeleton } from "@heroui/react";
import { IoChevronForward } from "react-icons/io5";
import { useTranslations } from "next-intl";

import ExpandableList from "./expandable-list";

interface SelectionBlockProps {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  data?: any[];
  renderItem?: (item: any) => React.ReactNode;
  isEmpty?: boolean;
  emptyText?: string;
}

export default function SelectionBlock({
  title,
  onClick,
  isLoading,
  children,
  data,
  renderItem,
  isEmpty,
  emptyText,
}: SelectionBlockProps) {
  const t = useTranslations("components.common.selectBlock");

  // Determine emptiness logic:
  // 1. If isEmpty is explicitly boolean, use it.
  // 2. Else if data is array, isEmpty = data.length === 0.
  // 3. Else defaults to false.
  const isActuallyEmpty =
    typeof isEmpty === "boolean"
      ? isEmpty
      : Array.isArray(data)
        ? data.length === 0
        : false;

  return (
    <div className="rounded-lg bg-white p-3">
      <div
        className="mb-2 flex cursor-pointer items-center justify-between"
        role="button"
        onClick={onClick}
      >
        <div className="text-base font-semibold">{title}</div>
        {onClick && !isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <span>{t("select")}</span>
            <IoChevronForward size={16} />
          </div>
        )}
      </div>
      <div className="space-y-1">
        {isLoading ? (
          <Skeleton className="h-12 rounded-lg" />
        ) : isActuallyEmpty ? (
          <div
            className="cursor-pointer rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-400"
            role="button"
            onClick={onClick}
          >
            {emptyText || t("emptyText")}
          </div>
        ) : (
          <div>
            {children}
            {Array.isArray(data) && renderItem && (
              <ExpandableList
                defaultExpanded
                items={data}
                renderItem={renderItem}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
