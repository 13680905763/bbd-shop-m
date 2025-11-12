"use client";

import React, { useState } from "react";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Checkbox, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import MessageItem from "./message-item";

import ConfirmModal from "@/components/confirm-modal";
import { useMessageList } from "@/hook";
import { queryClient } from "@/lib/react-query";
import { delMessage, readMessage } from "@/services";

const tabKeyToStatusCode: any = {
  all: "",
  unread: 0,
  read: 1,
};

export default function MessagePage() {
  const t = useTranslations("profile.messagePage");
  const [activeTab, setActiveTab] = useState("all");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [modalType, setModalType] = useState<"view" | "delete" | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const router = useRouter();
  const { data, fetchNextPage, hasNextPage } = useMessageList(
    tabKeyToStatusCode[activeTab],
  );

  const messageList = data?.pages?.flatMap((page: any) => page.records) ?? [];

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setModalType("view");
  };

  const handleSelectMessage = (message: any, checked: boolean) => {
    setSelectedMessages((prev) =>
      checked ? [...prev, message] : prev.filter((m) => m.id !== message.id),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    console.log("checked", checked, [...messageList]);

    setSelectedMessages(checked ? [...messageList] : []);
  };

  const handleDeleteSelected = () => {
    if (selectedMessages.length === 0) return;
    setModalType("delete");
  };

  const handleConfirmDelete = async () => {
    try {
      const ids = selectedMessages.map((m) => m.id);

      await delMessage(ids);
      setSelectedMessages([]);
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    } catch (error) {
      console.error("删除失败", error);
    } finally {
      setModalType(null);
    }
  };
  const handleMarkAsRead = async () => {
    if (!selectedMessage || selectedMessage.statusCode !== 0) {
      setModalType(null);

      return;
    }

    try {
      await readMessage(selectedMessage.id); // 调用已读接口
      // 手动更新本地状态
      selectedMessage.statusCode = 1;
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    } catch (error) {
      console.error("标记已读失败", error);
    } finally {
      setModalType(null);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between bg-[#f7f8f9]">
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("navBar.cancel") : t("navBar.manage")}
          </button>
        }
        onBack={() => router.back()}
      >
        {t("navBar.title")}
      </NavBar>

      <Tabs
        aria-label="Options"
        classNames={{
          base: "w-full bg-white p-1",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
          tab: "px-0 h-12 flex-1",
          cursor: "h-0",
          tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
          panel: "bg-[#f7f8f9] px-2 flex-1 overflow-auto",
        }}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(String(key))}
      >
        {["all", "unread", "read"].map((key) => (
          <Tab
            key={key}
            title={
              key === "all"
                ? t("tabs.all")
                : key === "unread"
                  ? t("tabs.unread")
                  : t("tabs.read")
            }
          >
            {messageList?.map((message: any) => (
              <MessageItem
                key={message.id}
                isEdit={isEdit}
                message={message}
                selected={selectedMessages.some((m) => m.id === message.id)}
                onSelect={handleSelectMessage}
                onView={handleViewMessage}
              />
            ))}
            <InfiniteScroll
              hasMore={!!hasNextPage}
              loadMore={() => fetchNextPage().then(() => undefined)}
            />
          </Tab>
        ))}
      </Tabs>

      {isEdit && (
        <div className="flex items-center justify-between border-t bg-white px-4 py-2">
          <Checkbox
            isSelected={
              messageList.length > 0 &&
              selectedMessages.length === messageList.length
            }
            onValueChange={(checked: boolean) => handleSelectAll(checked)}
          >
            {t("bottomBar.selectAll")}
          </Checkbox>
          <button
            className="rounded bg-red-500 px-4 py-2 text-white"
            onClick={handleDeleteSelected}
          >
            {t("bottomBar.delete")}
          </button>
        </div>
      )}

      <ConfirmModal
        cancelText={
          modalType === "view" ? t("modal.view.close") : t("modal.delete.close")
        }
        confirmText={modalType === "view" ? "" : t("modal.delete.confirm")}
        content={
          modalType === "view"
            ? (selectedMessage?.content ?? t("modal.view.noContent"))
            : t("modal.delete.content", { count: selectedMessages.length })
        }
        isOpen={modalType !== null}
        showConfirm={
          !(modalType === "view" && selectedMessage?.statusCode !== 0)
        }
        title={
          modalType === "view"
            ? selectedMessage?.title
            : t("modal.delete.title")
        }
        onConfirm={
          modalType === "view" ? handleMarkAsRead : handleConfirmDelete
        }
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </div>
  );
}
