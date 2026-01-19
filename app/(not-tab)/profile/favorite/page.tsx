"use client";
import { Button, Checkbox, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import ProductItem from "./product-item";

import { useFavorite, useSelection } from "@/hook";
import { HistoryProduct } from "@/types";
import ConfirmModal from "@/components/confirm-modal";
import { delFavorite } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { queryClient } from "@/lib/react-query";

export default function Favorite() {
  const t = useTranslations("favorite");
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading } = useFavorite();
  const favoriteList = (data as unknown as HistoryProduct[]) || [];

  const {
    selectedIds,
    isSelected,
    toggle,
    hasSelected,
    isAllSelected,
    unselectAll,
    toggleSelectAll,
  } = useSelection(favoriteList, { idKey: "id" });

  const handleDelete = async () => {
    await delFavorite(selectedIds as string[]);
    await queryClient.invalidateQueries({ queryKey: ["favorite"] }); // 手动刷新
    unselectAll();
    onOpenChange();
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
      <div className="no-scrollbar flex-1 space-y-2 overflow-auto p-2">
        {favoriteList.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-sm text-gray-400">
            {t("empty")}
          </div>
        ) : (
          favoriteList.map((product) => (
            <ProductItem
              key={product.id}
              isEdit={isEdit}
              isSelected={isSelected(product.id)}
              product={product}
              onToggle={() => toggle(product.id)}
            />
          ))
        )}
      </div>
      {isEdit && favoriteList.length > 0 ? (
        <div className="bottom-settle">
          <Checkbox isSelected={isAllSelected} onValueChange={toggleSelectAll}>
            {t("selectAll")}
          </Checkbox>
          <Button color="primary" isDisabled={!hasSelected} onPress={onOpen}>
            {t("delete")}{" "}
            {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </Button>
        </div>
      ) : null}

      <ConfirmModal
        content={t("deleteConfirmContent")}
        isOpen={isOpen}
        title={t("deleteConfirmTitle")}
        onConfirm={handleDelete}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
