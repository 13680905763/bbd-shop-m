"use client";
import { Button, Checkbox, Textarea } from "@heroui/react";
import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";

import ConfirmModal from "@/components/confirm-modal";
import { deleteCart, updateCart } from "@/services/cart";
import { useCartList } from "@/hook";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useSelection } from "@/hook/useSelection";
import { debounce } from "@/lib/debounce";
import { createOrderPreviewKeyByCart } from "@/services";
import { calculateTotal } from "@/lib/utils";

type ModalType = "delete" | "remark" | null;
interface ModalState {
  type: ModalType;
  confirm?: (remark?: any) => Promise<void>;
  productId?: any[]; // 退款 modal 选中商品信息
}
export default function Cart() {
  const t = useTranslations("cart"); // ✅ 命名空间 cart
  const { currency } = useGlobalStore();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useCartList();

  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading
  const [modal, setModal] = useState<ModalState>({ type: null });

  const [remark, setRemark] = useState("");

  // 扁平化购物车数据
  const flatList =
    useMemo(() => {
      return data?.flatMap((shop) => shop.cartList);
    }, [data]) ?? [];

  const {
    selectedIds,
    isSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
    hasSelected,
    isGroupAllSelected,
    toggleGroup,
    unselectAll,
  } = useSelection(flatList, {
    idKey: "id",
    groupKey: "shopId",
  });

  // 打开删除弹窗
  const openDeleteModal = () => {
    setModal({
      type: "delete",
      confirm: async () => {
        await deleteCart({ idList: selectedIds });
        await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
        unselectAll();
        setModal({ type: null });
      },
    });
  };
  // 打开备注弹窗
  const openRemarkModal = (productId: any, productRemark: any) => {
    setRemark(productRemark);
    setModal({
      type: "remark",
      confirm: async (remark) => {
        await updateCart([
          {
            id: productId,
            remark: remark,
          },
        ]);
        await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
        setModal({ type: null });
      },
    });
  };
  // 防抖函数：只创建一次
  const debouncedUpdate = useRef(
    debounce(async (productId: string, quantity: number) => {
      await updateCart([
        {
          id: productId,
          quantity,
        },
      ]);
      await queryClient.invalidateQueries({ queryKey: ["cartList"] });
    }),
  ).current;

  // 给 Stepper 用的 onChange
  const handleProductQuantity = (productId: string, quantity: number) => {
    debouncedUpdate(productId, quantity); // 调用防抖
  };

  //结算/删除购物车
  const submitCart = async () => {
    if (isEdit) {
      openDeleteModal();

      return;
    }
    try {
      setIsSubmitting(true);
      const previewList = (selectedIds as string[]).map((cartId) => ({
        cartId,
        serviceList: [],
      }));
      const key: string = await createOrderPreviewKeyByCart({ previewList });

      router.push("/submit/order?type=cart&key=" + key);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  // 总价
  const togglePrice = useMemo(() => {
    const ids = selectedIds as string[];
    const selectedPrices = flatList
      .filter((item) => ids.includes(item.id))
      .map((item) => item.totalFee || 0);

    return calculateTotal(selectedPrices);
  }, [selectedIds, flatList]);

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
      <div className="flex-1 overflow-auto px-2">
        {flatList.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-lg font-semibold text-gray-900">
              {t("empty.title")}
            </div>
            <div className="mt-2 text-sm text-gray-500">{t("empty.desc")}</div>
            <Button
              className="mt-6 px-8"
              color="primary"
              onPress={() => router.push("/goods/search")}
            >
              {t("empty.goShopping")}
            </Button>
          </div>
        ) : (
          data?.map((c) => (
            <CartItem
              key={c.shopId}
              handleProductQuantity={handleProductQuantity}
              isGroupAllSelected={isGroupAllSelected(c.shopId)} //  店铺selected
              isSelected={isSelected}
              openRemarkModal={(productId: any, productRemark: any) =>
                openRemarkModal(productId, productRemark)
              }
              shop={c}
              toggle={toggle}
              toggleGroup={() => toggleGroup(c.shopId)} // 店铺onChange
            />
          ))
        )}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
          </div>
        )}
      </div>

      <div className="bottom-settle">
        <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
          {t("selectAll")}
        </Checkbox>
        <div className="flex items-center gap-2">
          <p className="text-price-lg">
            {currency.symbol}
            {togglePrice}
          </p>
          <Button
            color="primary"
            isDisabled={!hasSelected}
            isLoading={isSubmitting}
            onPress={submitCart}
          >
            {isEdit ? t("delete") : t("checkout")}{" "}
            {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </Button>
        </div>
      </div>

      {modal.type === "delete" && (
        <ConfirmModal
          isOpen
          content={t("deleteContent")}
          title={t("deleteTitle")}
          onConfirm={modal.confirm as () => Promise<void>}
          onOpenChange={() => setModal({ type: null })}
        />
      )}
      {modal.type === "remark" && (
        <CommonModal
          isOpen
          title={t("remark.title")}
          onConfirm={async () => {
            if (modal?.confirm) await modal?.confirm(remark);
          }}
          onOpenChange={() => setModal({ type: null })}
        >
          <Textarea
            classNames={{
              input: "text-base",
            }}
            placeholder={t("remark.placeholder")}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </CommonModal>
      )}
    </>
  );
}
