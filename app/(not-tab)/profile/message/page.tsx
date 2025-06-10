"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import OrderCard from "./order-card";

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
  createTime: string;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};
const a = [
  {
    cartList: [
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
    ],
    shopId: "116636910",
    shopName: "2025-06-04 ",
  },
  {
    cartList: [
      {
        createTime: "2025-06-04 16:54:42",
        customerId: "1",
        id: "44",
        picUrl:
          "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
        postFee: 0,
        price: 32800,
        productId: "8",
        productSkuId: "27",
        productTitle:
          "ElectronicNomad水洗大师美式可爱卡通Mega Man休闲210克短袖T恤",
        productUrl: "https://item.taobao.com/item.htm?id=753636500587",
        quantity: 8,
        remark: "啊啊√嗄高5 ",
        shopId: "422959361",
        shopName: "ElectronicNomad 水洗大师",
        sku: {
          propId_valueId: "1627207:28320;20509:28317",
          propName_valueName: "颜色:白色 210g;尺码:XL",
        },
        skuPicUrl:
          "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
        source: "TAOBAO",
        sourceMpId: "2048292428750955",
        sourceMpSkuId: "6409896850539",
        sourceProductId: "753636500587",
        sourceSkuId: "5199275453160",
        status: 1,
        totalPrice: 262400,
        updateTime: "2025-06-04 18:01:30",
      },
    ],
    shopId: "422959361",
    shopName: "2022-03-04 ",
  },
];

export default function SubmitOrder() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();
  const changePrice = (price: any) => {
    setCurrentPrice(price);
  };

  return (
    <div className="flex h-screen flex-col justify-between bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        消息
      </NavBar>
      <div className="flex-1 overflow-auto p-2">
        {a.map((shop: any) => (
          <OrderCard key={shop.shopId} shop={shop} />
        ))}
      </div>
    </div>
  );
}
