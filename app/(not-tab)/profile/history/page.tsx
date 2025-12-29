"use client";
import { Button, Checkbox, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

// import ShopCard from "./shop-card";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

const a = [
  {
    createTime: "2025-06-04 18:39:55",
    customerId: "1",
    id: "48",
    picUrl:
      "https://img.alicdn.com/bao/uploaded/i3/2376087644/O1CN01PGccxl26L0XTI5AvF_!!2376087644.jpg",
    postFee: 0,
    price: 5000,
    productId: "9",
    productSkuId: "31",
    productTitle:
      "海外订单尾货~剪标撤回外贸潮流痞帅短袖T恤男女同款百搭宽松上衣",
    productUrl: "https://item.taobao.com/item.htm?id=855863456744",
    quantity: 1,
    remark: "demoData",
    shopId: "116636910",
    shopName: "VSFRR SKY IDCCO",
    sku: {
      propId_valueId: "1627207:380850593",
      propName_valueName: "颜色分类:白色XXL",
    },
    skuPicUrl:
      "https://img.alicdn.com/bao/uploaded/i2/2376087644/O1CN01vMge8x26L0XSEtPMe_!!2376087644.jpg",
    source: "TAOBAO",
    sourceMpId: "4096257174111208",
    sourceMpSkuId: "23990356503528",
    sourceProductId: "855863456744",
    sourceSkuId: "5828221219298",
    status: 1,
    totalPrice: 5000,
    updateTime: "2025-06-04 18:39:55",
  },
  {
    createTime: "2025-06-04 19:20:05",
    customerId: "1",
    id: "51",
    picUrl:
      "https://img.alicdn.com/bao/uploaded/i3/2376087644/O1CN01PGccxl26L0XTI5AvF_!!2376087644.jpg",
    postFee: 0,
    price: 5000,
    productId: "9",
    productSkuId: "34",
    productTitle:
      "海外订单尾货~剪标撤回外贸潮流痞帅短袖T恤男女同款百搭宽松上衣",
    productUrl: "https://item.taobao.com/item.htm?id=855863456744",
    quantity: 1,
    shopId: "116636910",
    shopName: "VSFRR SKY IDCCO",
    sku: {
      propId_valueId: "1627207:35962878",
      propName_valueName: "颜色分类:白色L",
    },
    skuPicUrl:
      "https://img.alicdn.com/bao/uploaded/i2/2376087644/O1CN01vMge8x26L0XSEtPMe_!!2376087644.jpg",
    source: "TAOBAO",
    sourceMpId: "4096257174111208",
    sourceMpSkuId: "23990356501480",
    sourceProductId: "855863456744",
    sourceSkuId: "5828221219296",
    status: 1,
    totalPrice: 5000,
    updateTime: "2025-06-04 19:20:05",
  },
];

export default function HistoryPage() {
  const t = useTranslations("history");
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});

  return (
    <div className="flex h-[calc(var(--vh)_*_100)] flex-col justify-between overflow-hidden">
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("cancel") : t("manage")}
          </button>
        }
        onBack={() => router.back()}
      >
        {t("title")}
      </NavBar>

      <div className="flex-1 overflow-auto px-3">
        {/* {a.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))} */}
      </div>
      {isEdit ? (
        <div className="flex items-center justify-between border-b border-[#f5f5f5] bg-white px-3 py-2">
          <div>
            <Checkbox>{t("selectAll")}</Checkbox>
          </div>
          <div className="flex items-center gap-2">
            <Button color="primary">{t("delete")}</Button>
          </div>
        </div>
      ) : null}

      {/* 
      <ConfirmModal
        content={t("deleteConfirmContent")}
        isOpen={isOpen}
        title={t("deleteConfirmTitle")}
        onOpenChange={onOpenChange}
      /> */}
    </div>
  );
}
