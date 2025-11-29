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
  const { data, isLoading, isError } = useCartList();

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
    // groupIds,
    hasSelected,
    isGroupAllSelected,
    toggleGroup,
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePrice = useMemo(() => {
    const allItems = data?.flatMap((shop) => shop.cartList) ?? [];

    const selectedItems = allItems.filter((item) =>
      selectedIds.includes(item.id),
    );

    const total = selectedItems.reduce((sum, item) => {
      // 保证 fee 是数字
      const fee =
        Number(item.totalFee ?? item.unitPrice ?? 0) *
        Number(item.quantity ?? 1);

      return sum + fee;
    }, 0); // 初始值必须是数字 0

    return total.toFixed(2); // total 一定是数字，toFixed 安全
  }, [data, selectedIds]);

  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-[100%] flex-col justify-between overflow-hidden">
      {isLoading && <FullscreenLoader />}
      <div className="flex justify-between p-2">
        <div>
          <span className="text-lg font-bold">
            {t("title")}（ {data?.flatMap((shop) => shop.cartList).length}）
          </span>
        </div>
        <div className="flex items-center">
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("cancel") : t("manage")}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-3">
        {data?.map((c) => (
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
        ))}
      </div>
      <div className="flex items-center justify-between border-b border-[#f5f5f5] bg-white px-3 py-2">
        <div className="flex gap-2">
          <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
            {t("selectAll")}
          </Checkbox>
          <span className="text-price-lg">{selectedIds.length}</span>
        </div>
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
            {isEdit ? t("delete") : t("checkout")}
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
            placeholder={t("remark.placeholder")}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </CommonModal>
      )}
    </div>
  );
}
