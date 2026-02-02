"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface ExpandableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  defaultExpanded?: boolean;
}

export default function ExpandableList<T>({
  items,
  renderItem,
  defaultExpanded = false,
}: ExpandableListProps<T>) {
  const t = useTranslations("components.common.expandableList");
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className={!isExpanded && index > 0 ? "hidden" : "block"}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div
          className="mt-2 flex cursor-pointer items-center justify-center border-t border-gray-100 pt-2 text-sm text-gray-500"
          role="button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mr-1">
            {isExpanded ? t("collapse") : t("expand")}
          </span>
          {isExpanded ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
        </div>
      )}
    </>
  );
}
