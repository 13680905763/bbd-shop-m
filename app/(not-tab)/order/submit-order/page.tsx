"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SubmitOrder() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();
  const changePrice = (price: any) => {
    setCurrentPrice(price);
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        订单支付
      </NavBar>
      <div className="h-full">
        <div>123</div>
        <div className="sticky bottom-0 bg-red-500">button</div>
      </div>
    </div>
  );
}
