"use client";

import React from "react";
import { Card, Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function MessageItem({
  message,
  isEdit,
  isSelected,
  onChange,
  onDetail,
}: any) {
  const t = useTranslations("profile.message");
  const isUnread = message.statusCode === 0;

  return (
    <Card
      className="mb-2 w-full    gap-3 rounded-xl bg-white p-4 text-left shadow-sm transition-all active:bg-gray-100"
      isPressable={!isEdit} // 编辑模式下不触发点击查看
      onClick={async () => !isEdit && (await onDetail?.(message))}
    >
      <div className=" w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* 编辑模式勾选框 */}
            {isEdit && (
              <Checkbox
                classNames={{
                  base: "p-0 m-0",
                  wrapper: "m-0",
                }}
                isSelected={isSelected(message.id)}
                onChange={() => onChange(message.id)}
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
            className={`min-w-[40px] text-right text-xs font-medium ${
              isUnread ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {isUnread ? t("unread") : t("read")}
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
