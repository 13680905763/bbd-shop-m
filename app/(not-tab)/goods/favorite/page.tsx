"use client";
import { addToast, Button, Checkbox, useDisclosure } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";

// import ShopCard from "./shop-card";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { useCart } from "@/services/hooks/useCart";
import { deleteCart } from "@/services/api/cart";
import ConfirmModal from "@/components/confirm-modal";
export type Product = {
  id: string;
  productTitle: string;
  sku: {
    propName_valueName: string;
  };
  skuPicUrl: string;
  remark?: string;
  totalPrice: number;
  price: number;
  postFee: number;
  quantity: number;
  source: string;
  sourceProductId: string;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};

export default function Cart() {
  const { cartData, isLoading, isError, mutate } = useCart();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});

  function getSelectedProductIds(
    selected: Record<string, Record<string, boolean>>,
  ): string[] {
    const selectedIds: string[] = [];

    for (const shopId in selected) {
      const productMap = selected[shopId];

      for (const productId in productMap) {
        if (productMap[productId]) {
          selectedIds.push(productId);
        }
      }
    }

    return selectedIds;
  }
  const handleDeleteCart = (onClose: any) => {
    const selectedIdArr = getSelectedProductIds(selected);

    deleteCart({ idList: selectedIdArr }).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
        mutate();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };
  const handleCart = () => {
    const selectedIdArr = getSelectedProductIds(selected);

    if (selectedIdArr.length > 0) {
      if (isEdit) {
        onOpen();
        console.log("删除", { idList: selectedIdArr });
      } else {
        console.log("结算");
      }
    } else {
      addToast({
        title: "请先选择商品",
        timeout: 1000,
        // color: "success",
      });
    }
  };
  // 商品勾选
  const toggleItem = (shopId: string, productId: string, checked: boolean) => {
    console.log(shopId, productId, checked);

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
    cartData.every((shop: any) => {
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

    cartData.forEach((shop: any) => {
      newSelected[shop.shopId] = {};
      shop.cartList.forEach((product: any) => {
        newSelected[shop.shopId][product.id] = checked;
      });
    });
    setSelected(newSelected);
  };
  const togglePrice = useMemo(() => {
    const selectedIdArr = getSelectedProductIds(selected);

    return cartData
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIdArr.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => sum + item.totalPrice, 0); // 累加价格
  }, [selected]);

  useEffect(() => {
    if (cartData) {
      const init: typeof selected = {};

      cartData.forEach((shop: any) => {
        init[shop.shopId] = {};
        shop.cartList.forEach((product: any) => {
          init[shop.shopId][product.id] = false; // 初始不选中
        });
      });
      console.log("init", init);

      setSelected(init);
    }
  }, [cartData]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-[100%] flex-col justify-between overflow-hidden">
      <NavBar className="bg-white" onBack={() => router.back()}>
        商品详情
      </NavBar>
      <div className="flex justify-between p-2">
        <div>
          <span className="text-lg font-bold">Cart</span>
          (0)
        </div>
        <div className="flex items-center">
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "取消" : "管理"}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-3">
        {/* {cartData.map((shop: any) => (
          <ShopCard
            key={shop.shopId}
            isEdit={isEdit}
            mutate={mutate}
            selectedMap={selected[shop.shopId] || {}}
            shop={shop}
            onToggleItem={(productId, checked) =>
              toggleItem(shop.shopId, productId, checked)
            }
            onToggleShop={(checked) => toggleShop(shop, checked)}
          />
        ))} */}
      </div>
      <div className="flex items-center justify-between border-b border-[#f5f5f5] bg-white px-3 py-2">
        <div>
          <Checkbox
            isSelected={isAllSelected()}
            onChange={(e) => toggleAll(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-price-lg">￥{togglePrice}</p>
          <Button color="primary" onPress={handleCart}>
            {isEdit ? "删除" : "结算"}
          </Button>
        </div>
      </div>

      <ConfirmModal
        content="确定要删除当前商品吗？"
        isOpen={isOpen}
        title="删除购物车"
        onConfirm={handleDeleteCart}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
