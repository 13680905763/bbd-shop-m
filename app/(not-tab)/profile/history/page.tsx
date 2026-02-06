"use client";
import { Button, Checkbox, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import ProductItem from "./product-item";

import { useDelHistory, useHistory } from "@/hook/api";
import { HistoryProduct } from "@/types";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useSelection, useConfirm } from "@/hook/common";
import { BottomAction } from "@/components/common";

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
          <div className="flex h-full flex-col items-center justify-center text-sm text-gray-400">
            {t("empty")}
          </div>
        ) : (
          historyList.map((product) => (
            <ProductItem
              key={product.id}
              isEdit={isEdit}
              isSelected={isSelected(product.id)}
              product={product}
              onToggle={() => onSelect(product.id)}
            />
          ))
        )}
      </div>
      {isEdit && historyList.length > 0 && (
        <BottomAction
          isLoading={false}
          buttonText={t("delete")}
          isAllSelected={isAllSelected}
          selectedCount={selectedIds.length}
          onPress={handleDelete}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}
    </>
  );
}
