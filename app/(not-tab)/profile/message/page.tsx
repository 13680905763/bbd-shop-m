"use client";

import React, { useState } from "react";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Spinner, Tab, Tabs } from "@heroui/react";
import { useTranslation } from "react-i18next";

import MessageItem from "./message-item";

import ConfirmModal from "@/components/modal/confirm-modal";
import { useMessageList } from "@/hook";
import { queryClient } from "@/lib/react-query";
import { delMessage, readMessage } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useSelection } from "@/hook/useSelection";

const tabKeyToStatusCode: any = {
  all: "",
  unread: 0,
  read: 1,
};

type ModalType = "delete" | "detail" | null;
interface ModalState {
  type: ModalType;
  confirm?: () => Promise<void>;
  message?: any;
}
export default function MessagePage() {
  const { t } = useTranslation("translation", { keyPrefix: "profile.message" });

  const [activeTab, setActiveTab] = useState("all");
  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useMessageList(tabKeyToStatusCode[activeTab]);

  const messages = data?.pages?.flatMap((page: any) => page.records) ?? [];
  // ================= 使用 useSelection =================
  const {
    selectedIds,
    isSelected,
    hasSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
    unselectAll,
  } = useSelection(messages, { idKey: "id" });

  const [modal, setModal] = useState<ModalState>({ type: null });

  const openDeleteModal = () => {
    setModal({
      type: "delete",
      confirm: async () => {
        await delMessage(selectedIds);
        await queryClient.invalidateQueries({ queryKey: ["messageList"] });
        setModal({ type: null });
        setIsEdit(false);
      },
    });
  };
  const openDetailModal = (message: any) => {
    setModal({
      type: "detail",
      confirm: async () => {
        await readMessage(message.id); // 调用已读接口
        await queryClient.invalidateQueries({ queryKey: ["messageList"] });
        setModal({ type: null });
      },
      message,
    });
  };

  const MessageTabContent = ({ messages }: { messages: any[] }) => {
    if (isLoading) return <FullscreenLoader />;
    if (!messages?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-lg text-gray-500">
          {t("noOrders")}
        </div>
      );

    return (
      <>
        {isFetching && !isFetchingNextPage && (
          <Spinner className="mb-2 flex justify-center text-gray-500" />
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m: any) => (
            <MessageItem
              key={m.id}
              activeTab={activeTab}
              isEdit={isEdit}
              message={m}
              selected={isSelected(m.id)}
              onChange={() => toggle(m.id)}
              onView={() => openDetailModal(m)} //取消订单
            />
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && (
            <div className="text-center text-[#999]">{t("noMoreRecords")}</div>
          )}
          {isFetchingNextPage && <Spinner />}
        </InfiniteScroll>
      </>
    );
  };

  return (
    <>
      <NavBar
        right={
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("cancel") : t("manage")}
          </button>
        }
        onBack={() => router.back()}
      >
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
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
        onSelectionChange={(key) => {
          setActiveTab(String(key));
          unselectAll();
        }}
      >
        {["all", "unread", "read"].map((key) => (
          <Tab key={key} title={t(`tabs.${key}`)}>
            <MessageTabContent messages={messages} />
          </Tab>
        ))}
      </Tabs>

      {isEdit && (
        <div className="flex items-center justify-between border-t bg-white px-4 py-2">
          <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
            {t("selectAll")}
          </Checkbox>
          <Button
            className="w-[150px]"
            color="primary"
            isDisabled={!hasSelected}
            onPress={openDeleteModal}
          >
            {t("delete")}
          </Button>
        </div>
      )}
      {modal.type === "delete" && (
        <ConfirmModal
          isOpen
          content={t("deleteContent", {
            count: selectedIds.length,
          })}
          title={t("deleteTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {modal.type === "detail" && (
        <ConfirmModal
          isOpen
          cancelText={t("detailCancel")}
          confirmText={t("detailConfirm")}
          content={modal?.message?.content}
          showConfirm={modal?.message?.statusCode == 0}
          title={modal?.message?.title}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
    </>
  );
}
