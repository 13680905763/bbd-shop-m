"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PayOrder() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();
  const changePrice = (price: any) => {
    setCurrentPrice(price);
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        确定订单
      </NavBar>
      <div className="px-2">
        <div className="box-card p-2 text-center">
          <div className="text-sm text-[#999]">总计</div>
          <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
            CAD 52.90
          </div>
          <p className="">cad123</p>
        </div>
      </div>
    </div>
  );
}
