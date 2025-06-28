"use client";

import { Button, NumberInput } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoWallet } from "react-icons/io5";

import { createOrderByRecharge } from "@/services";

export default function Settingpage() {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();

  const changePrice = (price: number) => {
    setCurrentPrice(price);
  };

  const handleRecharge = async () => {
    console.log("充值金额：", currentPrice);
    if (!currentPrice || currentPrice <= 0) {
      alert("请输入有效的充值金额");

      return;
    }
    const res: any = await createOrderByRecharge({
      currencyAmount: currentPrice,
      currencyCode: "CNY",
    });

    console.log("res", res);

    if (res.code === 200) {
      router.push(`/order/pay-order/${res.data}`);
    }
    // 你可以替换为实际充值接口调用
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => router.push("/wallet/balance-record")}>
            记录
          </button>
        }
        onBack={() => router.back()}
      >
        我的账户
      </NavBar>

      <div className="px-2">
        {/* 余额展示区域 */}
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

        {/* 快捷金额选择区域 */}
        <div>
          <div className="text-sm font-bold">选择充值金额</div>
          <div className="mx-auto my-2 grid grid-cols-3 grid-rows-2 gap-[5px]">
            {priceList.map((item) => (
              <button
                key={item}
                className={`flex cursor-pointer items-center justify-center rounded-[10px] bg-white py-3 ${
                  Number(currentPrice) === item
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

        {/* 自定义金额输入区域 */}
        <div>
          <div className="text-sm font-bold">其他金额</div>
          <NumberInput
            className="my-2"
            classNames={{ inputWrapper: "bg-white" }}
            placeholder="请输入其他金额"
            size="lg"
            startContent={<IoWallet className="h-6 w-6" />}
            type="number"
            value={currentPrice}
            onValueChange={(value) => setCurrentPrice(value)}
          />
          <Button className="w-full" color="primary" onPress={handleRecharge}>
            充值1
          </Button>
        </div>
      </div>
    </div>
  );
}
