"use client";

import React, { useState } from "react";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MessageItem from "./message-item";

import { useConfirm, useSelection } from "@/hook/common";
import { BottomAction, CommonTabs } from "@/components/common";
import { useMessageList, useReadMessage, useDeleteMessage } from "@/hook/api";
import { BlockSpinner, EmptyState } from "@/components/ui";

const tabKeyToStatusCode: any = {
  all: "",
  unread: 0,
  read: 1,
};

export default function MessagePage() {
  const t = useTranslations("profile.message");
  const [activeTab, setActiveTab] = useState("all");
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetching } = useMessageList(
    tabKeyToStatusCode[activeTab],
  );

  const messages = data?.pages?.flatMap((page: any) => page.records) ?? [];
  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(messages, { idKey: "id" });
  const { mutateAsync: readMessage, isPending: isReadPending } =
    useReadMessage();
  const { mutateAsync: deleteMessage, isPending: isDeletePending } =
    useDeleteMessage();
  const { confirm } = useConfirm();

  const onDetail = async (message: any) => {
    await confirm({
      cancelText: t("detailCancel"),
      confirmText: t("detailConfirm"),
      content: message?.content || "",
      title: message?.title || "",
      showConfirm: !message?.statusCode,
      onConfirm: async () => {
        await readMessage(message.id); // 调用已读接口
      },
    });
  };
  const onDelete = async () => {
    await confirm({
      content: t("deleteContent", {
        count: selectedIds.length,
      }),
      title: t("deleteTitle"),
      onConfirm: async () => {
        await deleteMessage(selectedIds); // 调用删除接口
      },
    });
  };

  const renderMessageContent = () => {
    if (!messages?.length && !isFetching) return <EmptyState />;

    return (
      <>
        {isFetching && <BlockSpinner />}
        <div className="space-y-2">
          {messages.map((m: any) => (
            <MessageItem
              key={m.id}
              activeTab={activeTab}
              isEdit={isEdit}
              isSelected={isSelected}
              message={m}
              onChange={onSelect}
              onDetail={onDetail} //取消订单
            />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && <EmptyState className="!h-auto" />}
        </InfiniteScroll>
      </>
    );
  };
  const tabs = [
    {
      key: "all",
      title: t("tabs.all"),
      content: renderMessageContent(),
    },
    {
      key: "unread",
      title: t("tabs.unread"),
      content: renderMessageContent(),
    },
    {
      key: "read",
      title: t("tabs.read"),
      content: renderMessageContent(),
    },
  ];

  return (
    <>
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("cancel") : t("manage")}
          </button>
        }
        onBack={() => router.back()}
      >
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key) => {
          setActiveTab(String(key));
          // unselectAll()
        }}
      />
      {isEdit && messages.length > 0 && (
        <BottomAction
          buttonText={t("delete")}
          isAllSelected={isAllSelected}
          isLoading={false}
          selectedCount={selectedIds.length}
          onPress={onDelete}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
    </>
  );
}
