"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { HistoryProductItem } from "@/components/item-list";
import { useDelHistory, useHistory } from "@/hook/api";
import { HistoryProduct } from "@/types";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useSelection, useConfirm } from "@/hook/common";
import { BottomAction } from "@/components/common";
import { EmptyState } from "@/components/ui";

export default function History() {
  const t = useTranslations("history");
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const { confirm } = useConfirm();

  const { data, isLoading } = useHistory();
  const { mutateAsync: delHistory } = useDelHistory();

  const historyList = (data as unknown as HistoryProduct[]) || [];

  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(historyList, { idKey: "id" });

  const handleDelete = async () => {
    await confirm({
      content: t("deleteConfirmContent"),
      title: t("deleteConfirmTitle"),
      onConfirm: async () => {
        await delHistory(selectedIds as string[]);
      },
    });
  };

  return (
    <>
      <NavBar
        className="bg-white"
        right={
          <div
            className="px-2 text-sm"
            role="button"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? t("cancel") : t("manage")}
          </div>
        }
        onBack={() => router.back()}
      >
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      {isLoading && <FullscreenLoader />}
      <div className="no-scrollbar flex-1 space-y-2 overflow-auto p-2 scrollbar-hide">
        {historyList.length === 0 ? (
          <EmptyState />
        ) : (
          historyList.map((product) => (
            <HistoryProductItem
              key={product.id}
              isEdit={isEdit}
              isSelected={isSelected(product.id)}
              product={product}
              onToggle={() => onSelect(product.id)}
            />
          ))
        )}
        {!!historyList.length && <EmptyState className="!h-auto" />}
      </div>
      {isEdit && historyList.length > 0 && (
        <BottomAction
          buttonText={t("delete")}
          isAllSelected={isAllSelected}
          isLoading={false}
          selectedCount={selectedIds.length}
          onPress={handleDelete}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
    </>
  );
}
