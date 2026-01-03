"use client";
import { Button, Checkbox, Textarea } from "@heroui/react";
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
import CommonModal from "@/components/modal/common-modal";
import ConfirmModal from "@/components/modal/confirm-modal";

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
  const { data, isLoading, isFetching } = useCartList();

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

    // 转换为分（cents）计算，避免小数
    const totalInCents = selectedItems.reduce((sumInCents, item) => {
      let itemTotalInCents = 0;

      // 情况1: totalFee 是总价
      if (item.totalFee !== undefined && item.totalFee !== null) {
        itemTotalInCents = Math.round(Number(item.totalFee) * 100);
      }
      // 情况2: 单价 × 数量
      else if (item.unitPrice !== undefined && item.quantity !== undefined) {
        // 单价转换为分，乘以数量
        const unitPriceInCents = Math.round(Number(item.unitPrice) * 100);
        const quantity = Number(item.quantity);

        itemTotalInCents = Math.round(unitPriceInCents * quantity);
      }

      return sumInCents + itemTotalInCents;
    }, 0);

    // 转换回元，并格式化为2位小数
    const total = totalInCents / 100;

    return total.toFixed(2);
  }, [data, selectedIds]);

  return (
    <>
      {isLoading && <FullscreenLoader />}

      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-2">
        <div>
          <span className="text-lg font-bold text-gray-900">
            {t("title")}
            <span className="ml-1 text-sm font-normal text-gray-500">
              ({data?.flatMap((shop) => shop.cartList).length ?? 0})
            </span>
          </span>
        </div>
        <button
          className="text-sm font-semibold text-gray-600 active:opacity-70"
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? t("cancel") : t("manage")}
        </button>
      </div>

      {/* 购物车列表 - 增加底部 padding 防止被底部栏遮挡 */}
      <div className="flex-1 space-y-3 overflow-y-auto p-2">
        {flatList.length === 0 && !isLoading && (
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
        )}
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
      {isFetching && !isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
        </div>
      )}
      {/* 底部结算栏 - 固定在 TabBar 之上 */}
      <div className="border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              classNames={{ label: "text-sm text-gray-600" }}
              isSelected={isAllSelected}
              onChange={toggleSelectAll}
            >
              {t("selectAll")}
            </Checkbox>
          </div>

          <div className="flex items-center gap-3">
            {!isEdit && (
              <div className="text-right">
                <p className="text-lg font-bold text-[#f0700c]">
                  <span className="mr-0.5">{currency.symbol}</span>
                  {togglePrice}
                </p>
              </div>
            )}

            <Button
              className={`h-10 min-w-[100px] rounded-full px-6 font-medium text-white shadow-md`}
              color="primary"
              isDisabled={!hasSelected}
              isLoading={isSubmitting}
              size="md"
              onPress={submitCart}
            >
              {isEdit ? t("delete") : t("checkout")}({selectedIds.length})
            </Button>
          </div>
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
