"use client";
import {
  addToast,
  Button,
  Checkbox,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ShopCard from "./shop-card";

import ConfirmModal from "@/components/confirm-modal";
import { deleteCart, updateCart } from "@/services/cart";
import { createOrderPreviewKeyByCart } from "@/services";
import { useCartList } from "@/hook";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Cart() {
  const t = useTranslations("cart"); // ✅ 命名空间 cart
  const { currency } = useGlobalStore();
  const { data, isLoading, isError, isFetching } = useCartList();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 当前要删除的商品 id（单个为 string，批量为 string[]，默认 null）
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(
    null,
  );
  const [pendingRemarkProductId, setPendingRemarkProductId] = useState<
    string | null
  >(null);
  const [remarkText, setRemarkText] = useState("");
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});
  const selectedIdArr = useMemo(() => {
    const selectedIds: string[] = [];

    for (const shopId in selected) {
      const productMap = selected[shopId];

      for (const productId in productMap) {
        if (productMap[productId]) {
          selectedIds.push(productId);
        }
      }
    }
    console.log("selectedIds", selectedIds);

    return selectedIds;
  }, [selected]);
  const handleDeleteCart = async (idList: string[]) => {
    try {
      const tip = await deleteCart({ idList });

      addToast({ title: tip, timeout: 1000, color: "success" });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch (e) {}
  };
  const handleProductDelete = (productId: string) => {
    setPendingDeleteIds([productId]);
  };
  const handleProductQuantity = async (productId: string, quantity: number) => {
    try {
      const tip = await updateCart([
        {
          id: productId,
          quantity,
        },
      ]);

      addToast({ title: tip, timeout: 1000, color: "success" });
    } catch (e) {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    }
  };
  const handleProductRemark = (productId: string, remark: string) => {
    setPendingRemarkProductId(productId);
    setRemarkText(remark);
    onOpen();
  };
  const submitRemark = async () => {
    if (!pendingRemarkProductId) return;
    try {
      const res = await updateCart([
        {
          id: pendingRemarkProductId,
          remark: remarkText,
        },
      ]);

      addToast({ title: res, timeout: 1000, color: "success" });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 刷新
    } catch (e) {
    } finally {
      onOpenChange();
      setPendingRemarkProductId(null);
      setRemarkText("");
    }
  };
  //结算/删除购物车
  const submitCart = async () => {
    if (selectedIdArr.length > 0) {
      if (isEdit) {
        setPendingDeleteIds(selectedIdArr);
      } else {
        setSubmiting(true);
        const previewList = selectedIdArr.map((cartId: string) => ({
          cartId,
          serviceList: [],
        }));
        const key: any = await createOrderPreviewKeyByCart({
          previewList,
        });

        setSubmiting(false);

        router.push("/order/submit-order?type=cart&key=" + key);
      }
    } else {
      addToast({
        title: "请先选择商品",
        timeout: 1000,
        color: "danger",
      });
    }
  };
  // 商品勾选
  const toggleItem = (shopId: string, productId: string, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        [productId]: checked,
      },
    }));
  };
  // 是否所有商品都选中
  const isAllSelected = () =>
    data?.every((shop: any) => {
      return shop.cartList.every(
        (product: any) => selected[shop.shopId]?.[product.id],
      );
    });
  // 店铺全选
  const toggleShop = (shop: any, checked: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };

      next[shop.shopId] = {};

      shop.cartList.forEach((product: any) => {
        next[shop.shopId][product.id] = checked;
      });

      return next;
    });
  };
  // 全选
  const toggleAll = (checked: boolean) => {
    const newSelected: typeof selected = {};

    data?.forEach((shop) => {
      newSelected[shop.shopId] = {};
      shop.cartList.forEach((product: any) => {
        newSelected[shop.shopId][product.id] = checked;
      });
    });
    setSelected(newSelected);
  };
  const togglePrice = useMemo(() => {
    const totalCents = data
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIdArr.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => {
        // 将 totalFee 转成分（乘100取整）
        const fee = Math.round((item?.totalFee ?? 0) * 100);

        return sum + fee;
      }, 0);

    // 最终除以100，保留两位小数
    return totalCents !== undefined ? (totalCents / 100).toFixed(2) : "0.00";
  }, [selected]);

  useEffect(() => {
    if (data) {
      const init: typeof selected = {};

      data.forEach((shop) => {
        init[shop.shopId] = {};
        shop.cartList.forEach((product) => {
          init[shop.shopId][product.id] = false; // 初始不选中
        });
      });

      setSelected(init);
    }
  }, [data]);

  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-[100%] flex-col justify-between overflow-hidden">
      {(isLoading || isFetching) && <FullscreenLoader />}
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
        {data?.map((shop) => (
          <ShopCard
            key={shop.shopId}
            handleProductDelete={handleProductDelete}
            handleProductQuantity={handleProductQuantity}
            handleProductRemark={handleProductRemark}
            isEdit={isEdit}
            selectedMap={selected[shop.shopId] || {}}
            shop={shop}
            onToggleItem={(productId: any, checked: any) =>
              toggleItem(shop.shopId, productId, checked)
            }
            onToggleShop={(checked: any) => toggleShop(shop, checked)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between border-b border-[#f5f5f5] bg-white px-3 py-2">
        <div className="flex gap-2">
          <Checkbox
            isSelected={isAllSelected()}
            onChange={(e) => toggleAll(e.target.checked)}
          >
            {t("selectAll")}
          </Checkbox>
          <span className="text-price-lg">{selectedIdArr.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-price-lg">
            {currency.symbol}
            {togglePrice}
          </p>
          <Button color="primary" isLoading={submiting} onPress={submitCart}>
            {isEdit ? t("delete") : t("checkout")}
          </Button>
        </div>
      </div>

      <ConfirmModal
        content={t("confirm.deleteContent")}
        isOpen={!!pendingDeleteIds}
        title={t("confirm.deleteTitle")}
        onConfirm={() => {
          if (pendingDeleteIds) {
            handleDeleteCart(pendingDeleteIds);
          }
        }}
        onOpenChange={() => setPendingDeleteIds(null)}
      />
      <CommonModal
        isOpen={isOpen}
        title={t("remark.title")}
        onConfirm={submitRemark}
        onOpenChange={onOpenChange}
      >
        <Textarea
          placeholder={t("remark.placeholder")}
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
        />
      </CommonModal>
    </div>
  );
}
