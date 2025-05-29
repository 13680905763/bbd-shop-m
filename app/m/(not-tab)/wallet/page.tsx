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
        <div className="text-center box-card p-2">
          <div className="text-[24px] font-bold text-[#f3643a] my-[10px]">
            CAD 0.00
          </div>
          <div className="text-sm text-[#999]">总余额</div>
          <div className="flex px-[10px] py-[15px]  justify-center">
            <Button
              className="rounded-full  bg-white w-full border-1 "
              variant="bordered"
              onPress={() => router.push("/m/wallet/withdrawal")}
            >
              提现
            </Button>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">选择充值金额</div>
          <div className="grid grid-cols-3 grid-rows-2 gap-[5px] my-2 mx-auto">
            {priceList.map((item) => (
              <button
                key={item}
                className={`bg-white flex items-center justify-center py-3 rounded-[10px] cursor-pointer ${
                  currentPrice === item
                    ? "border border-orange-500 text-orange-600 font-semibold"
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
          <div className="text-sm font-bold ">其他金额</div>
          <Input
            className="my-2"
            placeholder="请输入其他金额"
            size="lg"
            startContent={<IoWallet className="w-6 h-6" />}
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
