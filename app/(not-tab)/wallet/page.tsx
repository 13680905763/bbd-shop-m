"use client";
import { Button, Input } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoWallet } from "react-icons/io5";

export default function Settingpage() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();
  const changePrice = (price: any) => {
    setCurrentPrice(price);
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        我的账户
      </NavBar>
      <div className="px-2">
        <div className="box-card p-2 text-center">
          <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
            CAD 0.00
          </div>
          <div className="text-sm text-[#999]">总余额</div>
          <div className="flex justify-center px-[10px] py-[15px]">
            <Button
              className="w-full rounded-full border-1 bg-white"
              variant="bordered"
              onPress={() => router.push("/wallet/withdrawal")}
            >
              提现
            </Button>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">选择充值金额</div>
          <div className="mx-auto my-2 grid grid-cols-3 grid-rows-2 gap-[5px]">
            {priceList.map((item) => (
              <button
                key={item}
                className={`flex cursor-pointer items-center justify-center rounded-[10px] bg-white py-3 ${
                  currentPrice === item
                    ? "border border-orange-500 font-semibold text-orange-600"
                    : ""
                }`}
                onClick={() => changePrice(item)}
              >
                ￥ {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">其他金额</div>
          <Input
            className="my-2"
            placeholder="请输入其他金额"
            size="lg"
            startContent={<IoWallet className="h-6 w-6" />}
            type="number"
          />
          <Button className="w-full" color="primary">
            充值
          </Button>
        </div>
      </div>
    </div>
  );
}
