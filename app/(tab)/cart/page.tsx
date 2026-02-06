"use client";
import { Button, Checkbox } from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";
import EditRemarkModal from "./edit-remark-modal";

import { useGlobalStore } from "@/store";
import { useConfirm, useSelection } from "@/hook/common";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";
import {
  useCartList,
  useCreateOrderPreview,
  useDeleteCart,
  useUpdateCartItem,
} from "@/hook/api";
import { calculateTotalPrice } from "@/lib/price";

export default function Cart() {
  const t = useTranslations("cart"); // ✅ 命名空间 cart
  const { currency } = useGlobalStore();
  const router = useRouter();

  const { data, isLoading, isError, isFetching } = useCartList();
  const { mutateAsync: updateMutation, isPending: isUpdating } =
    useUpdateCartItem();
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteCart();
  const { mutateAsync: createOrderPreview, isPending: isSubmitting } =
    useCreateOrderPreview();
  const { confirm } = useConfirm();

  const [isEdit, setIsEdit] = useState(false);
  const [remarkModalState, setRemarkModalState] = useState<{
    open: boolean;
    productId: string;
    remark: string;
  }>({ open: false, productId: "", remark: "" });
  // 扁平化购物车数据
  const flatList: any =
    useMemo(() => {
      return data?.flatMap((shop: any) => shop.cartList);
    }, [data]) ?? [];

  const {
    selectedIds,
    isSelected,
    selectedItems,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    hasSelected,
    isGroupAllSelected,
    onToggleGroup,
  } = useSelection(flatList, {
    idKey: "id",
    groupKey: "shopId",
  });
  console.log('isDeleting', isDeleting);

  const deleteCart = async () => {
    await confirm({
      content: t("deleteContent"), // 弹窗正文
      title: t("deleteTitle"), // 弹窗标题
      isLoading: isDeleting,
      onConfirm: async () => {
        await deleteMutation({ idList: selectedIds });
      },
    });
  };
  const updateProductQuantity = async (productId: string, quantity: number) => {
    await updateMutation([
      {
        id: productId,
        quantity,
      },
    ]);
  };
  const submitCart = async () => {
    if (isEdit) {
      deleteCart();

      return;
    }
    try {
      const params = {
        previewList: selectedIds.map((cartId) => ({
          cartId,
          serviceList: [],
        })),
      };
      const key: string = await createOrderPreview(params);

      router.push("/submit/order?type=cart&key=" + key);
    } catch { }
  };
  const updateProductRemark = useCallback(
    (productId: string, remark: string) => {
      setRemarkModalState({ open: true, productId, remark });
    },
    [],
  );
  const submitProductRemark = async (newRemark: string) => {
    if (!remarkModalState.productId) return;
    await updateMutation([
      {
        id: remarkModalState.productId,
        remark: newRemark,
      },
    ]);
  };

  const togglePrice = useMemo(
    () => calculateTotalPrice(selectedItems, "totalFee" as any),
    [selectedItems],
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <div className="flex justify-between p-2">
        <span className="text-lg font-bold">
          {t("title")}({flatList?.length})
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
        {flatList.length === 0 ? (
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
              onQuantityChange={updateProductQuantity}
              onRemark={updateProductRemark}
            />
          ))
        )}
      </div>
      <div className="bottom-settle">
        <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
          {t("selectAll")}
        </Checkbox>
        <div className="flex items-center gap-2">
          {(togglePrice as unknown as number) != 0 && (
            <p className="text-price-lg">
              {currency.symbol}
              {togglePrice}
            </p>
          )}
          <Button
            color="primary"
            isDisabled={!hasSelected}
            isLoading={isSubmitting}
            onPress={submitCart}
          >
            {isEdit ? t("delete") : t("checkout")}
            {hasSelected && `(${selectedIds.length})`}
          </Button>
        </div>
      </div>
      <EditRemarkModal
        initialValue={remarkModalState.remark}
        isOpen={remarkModalState.open}
        onOpenChange={(open) =>
          setRemarkModalState((prev) => ({ ...prev, open }))
        }
        onSubmit={submitProductRemark}
      />
    </>
  );
}
