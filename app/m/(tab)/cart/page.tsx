"use client";
import {
  addToast,
  Button,
  Checkbox,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

import Stepper from "@/components/stepper";
import { useCart } from "@/services/hooks/useCart";
import { deleteCart } from "@/services/api/cart";

export default function Cart() {
  const { cartData, isLoading, isError, mutate } = useCart();

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
    <div className="flex flex-col justify-between  overflow-hidden h-[100%] ">
      <div className="flex justify-between p-2">
        <div>
          <span className="font-bold text-lg">Cart</span>
          (0)
        </div>
        <div className="flex  items-center">
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "取消" : "管理"}
          </button>
        </div>
      </div>
      <div className="overflow-auto flex-1 p-2 gap-2 flex flex-col">
        {cartData?.map((shop: any) => {
          return (
            <div key={shop.shopId} className="box-card !my-0">
              <div className="p-2">
                <Checkbox
                  isSelected={shop.cartList.every(
                    (p: any) => selected[shop.shopId]?.[p.id],
                  )}
                  onChange={(checked) =>
                    toggleShop(shop, checked.target.checked)
                  }
                />
                {shop.shopName}
              </div>
              {shop.cartList.map((product: any) => {
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 p-2 "
                  >
                    <Checkbox
                      isSelected={selected[shop.shopId]?.[product.id]}
                      onChange={(checked) =>
                        toggleItem(
                          shop.shopId,
                          product.id,
                          checked.target.checked,
                        )
                      }
                    />
                    {/* 商品图片 */}
                    <Image
                      alt="商品图"
                      className=" rounded-md object-cover flex-shrink-0"
                      height={100}
                      src={product.skuPicUrl ?? product.picUrl}
                    />
                    {/* 商品信息 */}
                    <div className="flex flex-col flex-1 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900 line-clamp-1">
                        {product.productTitle}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {product.sku.propName_valueName}
                      </div>

                      {/* 价格 + 数量控制 */}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-red-500 font-semibold">
                          ¥{product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Stepper />
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        运费:{product.postFee}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center p-2  border border-[#ccc] bg-white">
        <div>
          <Checkbox
            isSelected={isAllSelected()}
            onChange={(e) => toggleAll(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>
        <div>
          <Button color="primary" onPress={handleCart}>
            {isEdit ? "删除" : "结算"}
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                删除购物车
              </ModalHeader>
              <ModalBody>
                <p>确定要删除购物车的内容嘛？</p>
              </ModalBody>
              <ModalFooter className="flex gap-2">
                <Button
                  className="flex-1 button-default"
                  variant="light"
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button
                  className="flex-1"
                  color="primary"
                  onPress={() => handleDeleteCart(onClose)}
                >
                  删除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
