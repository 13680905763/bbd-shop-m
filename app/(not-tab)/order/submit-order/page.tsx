"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Button } from "@heroui/react";

import OrderCard from "./order-card";

import { createOrderByCart, createOrderByProduct } from "@/services";
import { useOrderPreview } from "@/hook";
import {
  createOrderPreviewKeyByCartParams,
  createOrderPreviewKeyByProductParams,
} from "@/types";

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

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;
  const { data, isLoading, isError } = useOrderPreview(type, key);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleCartSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (type === "cart") {
      const bizCode = await createOrderByCart(
        data?.param as createOrderPreviewKeyByCartParams,
      );

      router.push("/order/pay-order/" + bizCode);
    } else if (type === "product") {
      const bizCode = await createOrderByProduct(
        data?.param as createOrderPreviewKeyByProductParams,
      );

      router.push("/order/pay-order/" + bizCode);
    }
    setSubmitting(false);
  };
  const togglePrice = useMemo(() => {
    return data?.orderList
      ?.flatMap((order: any) => order.products) // 拍平所有商品
      ?.reduce((sum: any, item: any) => sum + item?.price * item.quantity, 0); // 累加价格
  }, [data]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-screen flex-col justify-between bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        订单支付
      </NavBar>
      <div className="flex-1 overflow-auto p-2">
        {data?.orderList?.map((order: any) => (
          <OrderCard key={order?.shopName} order={order} />
        ))}
        <div className="rounded-box mb-3 flex flex-col gap-2 px-2 py-3">
          <div className="flex justify-between">
            <div className="text-light-gray !text-sm">商品价格</div>
            <div className="text-title"> 714.84</div>
          </div>

          <div className="flex justify-between">
            <div className="text-light-gray !text-sm">国内快递费</div>
            <div className="text-title"> 714.84</div>
          </div>
          <div className="flex justify-between">
            <div className="text-light-gray !text-sm">服务费</div>
            <div className="text-title"> 714.84</div>
          </div>
          <div className="flex justify-between">
            <div className="text-light-gray !text-sm">总计</div>
            <div className="text-title"> 714.84</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 bg-white p-2">
        <div className="flex items-center gap-1 text-sm text-[#3d3d3d]">
          应付金额:
        </div>
        <p className="text-price-xl">{togglePrice}</p>
        <Button
          color="primary"
          isLoading={submitting}
          onPress={handleCartSubmit}
        >
          提交
        </Button>
      </div>
    </div>
  );
}
