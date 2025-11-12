"use client";

import React from "react";
import { Card, Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function MessageItem({
  message,
  isEdit,
  selected,
  onSelect,
  onView,
}: any) {
  const t = useTranslations("profile.messagePage.item");
  const isUnread = message.statusCode === 0;

  return (
    <Card
      className="mb-2 flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition-all active:bg-gray-100"
      isPressable={!isEdit} // 编辑模式下不触发点击查看
      onClick={() => !isEdit && onView?.(message)}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 编辑模式勾选框 */}
            {isEdit && (
              <Checkbox
                isSelected={selected}
                onValueChange={(val) => onSelect?.(message, val)}
              />
            )}
            <span
              className={`h-2 w-2 rounded-full ${
                isUnread ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
            <div className="font-semibold text-gray-900">{message.title}</div>
          </div>

          <span
            className={`text-xs font-medium ${
              isUnread ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {isUnread ? t("status.unread") : t("status.read")}
          </span>
        </div>

        <div className="mt-2 line-clamp-2 text-sm text-gray-600">
          {message.content}
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {message.createTime || ""}
        </div>
      </div>
    </Card>
  );
}
