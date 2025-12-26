"use client";
import { Button, Checkbox } from "@heroui/react";
import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import CartItem from "./cart-item";

import { deleteCart, updateCart } from "@/services/cart";
import { useCartList } from "@/hook";
import { useGlobalStore } from "@/store";
import { useSelection } from "@/hook/useSelection";
import { debounce } from "@/lib/debounce";
import { createOrderPreviewKeyByCart } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";

type ModalType = "delete" | "remark" | null;
interface ModalState {
  type: ModalType;
  confirm?: (remark?: any) => Promise<void>;
  productId?: any[]; // 退款 modal 选中商品信息
}
export default function Cart() {
  const { t } = useTranslation("translation", { keyPrefix: "cart" });

  const { currency } = useGlobalStore();
  const queryClient = useQueryClient();
  const { data, isLoading } = useCartList();

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
    } catch {
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

  return (
    <div className="flex h-[100vh] flex-col p-2">
      {isLoading && <FullscreenLoader />}

      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900">
            {t("title")}
            <span className="ml-1 text-sm font-normal text-gray-500">
              ({data?.flatMap((shop) => shop.cartList).length ?? 0})
            </span>
          </span>
        </div>
        <button
          className="text-sm font-medium text-gray-600 active:opacity-70"
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? "完成" : "管理"}
        </button>
      </div>

      {/* 购物车列表 - 增加底部 padding 防止被底部栏遮挡 */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {data?.map((c) => (
          <div
            key={c.shopId}
            className="overflow-hidden rounded-xl bg-white shadow-sm"
          >
            <CartItem
              handleProductQuantity={handleProductQuantity}
              isGroupAllSelected={isGroupAllSelected(c.shopId)}
              isSelected={isSelected}
              openRemarkModal={(productId: any, productRemark: any) =>
                openRemarkModal(productId, productRemark)
              }
              shop={c}
              toggle={toggle}
              toggleGroup={() => toggleGroup(c.shopId)}
            />
          </div>
        ))}
      </div>

      {/* 底部结算栏 - 固定在 TabBar 之上 */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+45px)] left-0 right-0 z-30 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              classNames={{ label: "text-sm text-gray-600" }}
              isSelected={isAllSelected}
              onChange={toggleSelectAll}
            >
              {"全选"}
            </Checkbox>
          </div>

          <div className="flex items-center gap-3">
            {!isEdit && (
              <div className="text-right">
                <p className="text-lg font-bold text-[#f0700c]">
                  <span className="mr-0.5 text-sm">{currency.symbol}</span>
                  {togglePrice}
                </p>
              </div>
            )}

            <Button
              className={`h-10 min-w-[100px] rounded-full px-6 font-medium text-white shadow-md ${
                isEdit
                  ? "bg-red-500 shadow-red-500/20"
                  : "bg-[#f0700c] shadow-orange-500/20"
              }`}
              isDisabled={!hasSelected}
              isLoading={isSubmitting}
              size="md"
              onPress={submitCart}
            >
              {isEdit
                ? `删除 (${selectedIds.length})`
                : `结算 (${selectedIds.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
