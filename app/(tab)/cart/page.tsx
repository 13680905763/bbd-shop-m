"use client";
import { Textarea } from "@heroui/react";
import React, { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";

import { useConfirm, useSelection } from "@/hook/common";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";
import {
  useCartList,
  useDeleteCart,
  useSubmitCart,
  useUpdateCartItem,
} from "@/hook/api";
import { calculateTotalPrice } from "@/lib/price";
import { SubmitCartData, UpdateCartData } from "@/services";
import { BottomAction } from "@/components/common";

export default function Cart() {
  const t = useTranslations("cart");
  const { confirm } = useConfirm();
  const { data, flatList, isLoading, isFetching } = useCartList();
  const { updateItem, isUpdating } = useUpdateCartItem();
  const { deleteItem, isDeleting } = useDeleteCart();
  const { submitCart, isSubmitting } = useSubmitCart();
  const [isEdit, setIsEdit] = useState(false);
  const remarkRef = useRef("");
  const {
    selectedIds,
    isSelected,
    selectedItems,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    isGroupAllSelected,
    onToggleGroup,
  } = useSelection(flatList, {
    idKey: "id",
    groupKey: "shopId",
  });
  const togglePrice = useMemo(() => {
    return calculateTotalPrice(selectedItems, "totalFee" as any);
  }, [selectedItems]);
  const previewList = useMemo(() => {
    return selectedIds.map((cartId): SubmitCartData["previewList"][number] => ({
      cartId,
      serviceList: [],
    }));
  }, [selectedIds]);
  const handleDelete = async (idList: string[]) => {
    await confirm({
      content: t("deleteContent"), // 弹窗正文
      title: t("deleteTitle"), // 弹窗标题
      isLoading: isDeleting,
      onConfirm: async () => {
        await deleteItem({ idList });
      },
    });
  };
  const handleQuantityChange = async (data: UpdateCartData) => { await updateItem(data) };
  const handleRemarkChange = async (data: UpdateCartData) => {
    await confirm({
      content: (
        <Textarea
          placeholder={t("remarkModal.placeholder")}
          defaultValue={data.remark || ""}
          onChange={(e) => remarkRef.current = e.target.value}
        />
      ),
      title: t("remarkModal.title"),
      onConfirm: async () => {
        await updateItem({ id: data.id, remark: remarkRef.current });
      },
    });
  };
  const handleSubmit = async () => {
    if (isEdit) return handleDelete(selectedIds);
    await submitCart({ previewList });
  };
  if (isLoading) return <FullscreenLoader />;
  return (
    <>
      <div className="flex justify-between p-2">
        <span className="text-lg font-bold">
          {t("title")}({flatList.length})
        </span>
        <button
          className="text-sm font-semibold"
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? t("cancel") : t("manage")}
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-auto px-2 pb-2 scrollbar-hide">
        {(isFetching || isUpdating) && <BlockSpinner />}
        {!flatList.length ? (
          <EmptyState desc={t("emptyDesc")} title={t("emptyTitle")} />
        ) : (
          data?.map((c: any) => (
            <CartItem
              key={c.shopId}
              cart={c}
              isGroupAllSelected={isGroupAllSelected} //  店铺selected
              isSelected={isSelected}
              toggle={onSelect}
              toggleGroup={onToggleGroup} // 店铺onChange
              onDelete={handleDelete}
              onQuantityChange={handleQuantityChange}
              onRemark={handleRemarkChange}
            />
          ))
        )}
      </div>
      <BottomAction
        buttonText={isEdit ? t("delete") : t("checkout")}
        isAllSelected={isAllSelected}
        isLoading={isSubmitting || isDeleting}
        selectedCount={selectedIds.length}
        onPress={handleSubmit}
        onToggleSelectAll={onToggleSelectAll}
        togglePrice={togglePrice}
      />
    </>
  );
}
