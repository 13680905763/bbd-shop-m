"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import NextLink from "next/link";

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
    shopName: "VSFRR SKY IDCCO",
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
    shopName: "ElectronicNomad 水洗大师",
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
        订单支付
      </NavBar>
      <div className="flex-1 overflow-auto p-2">
        {a.map((shop: any) => (
          <OrderCard key={shop.shopId} shop={shop} />
        ))}
        <div className="rounded-box mb-3 flex flex-col gap-2 px-2 py-3">
          <div className="text-title">价格信息</div>
          <div className="flex justify-between">
            <div>商品价格</div>
            <div className="text-price-xl">PLN 714.84</div>
          </div>

          <div className="flex justify-between">
            <div>国内快递费</div>
            <div className="text-price-xl">PLN 714.84</div>
          </div>
          <div className="flex justify-between">
            <div>服务费</div>
            <div className="text-price-xl">PLN 714.84</div>
          </div>
          <div className="flex justify-between">
            <div>总计</div>
            <div className="text-price-xl">PLN 714.84</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 bg-white p-2">
        <div className="flex items-center gap-1 text-sm text-[#3d3d3d]">
          应付金额:
        </div>
        <p className="text-price-xl">PLN 714.84</p>
        <NextLink href="/order/pay-order">
          <Button color="primary">提交</Button>
        </NextLink>
      </div>
    </div>
  );
}
