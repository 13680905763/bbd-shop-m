"use client";
import { Button, Radio, RadioGroup, Image, cn } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";

import { usePay } from "@/services/hooks/usePay";

export default function PayOrder() {
  const router = useRouter();

  const { payList, isLoading, isError } = usePay();

  console.log("payList", payList);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

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
        <div className="flex w-full flex-col gap-1">
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            defaultValue={"1"}
          >
            {payList.map((item: any) => (
              <div key={item.methodName}>
                <p className="text-title">{item.methodName}</p>
                {item.paymentList.map((payment: any) => {
                  if (payment.id == 1)
                    return (
                      <Radio
                        key={payment.id}
                        classNames={{
                          base: cn(
                            "inline-flex min-w-[100%] w-full bg-content1 m-0",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-lg gap-2 p-3 border-1",
                            "data-[selected=true]:border-primary",
                          ),
                          labelWrapper: "w-full",
                          label: "w-full ",
                        }}
                        value={payment.id}
                      >
                        <div>
                          <div className="flex justify-between px-1 py-2 text-sm">
                            <div className="flex items-center gap-4">
                              <div>余额</div>
                              <div className="">$ 999</div>
                            </div>
                            <Button color="primary">充值</Button>
                          </div>
                        </div>
                      </Radio>
                    );

                  return (
                    <Radio
                      key={payment.id}
                      classNames={{
                        base: cn(
                          "inline-flex min-w-[100%] w-full bg-content1 m-0  mb-2 ",
                          "hover:bg-content2 items-center justify-start",
                          "cursor-pointer rounded-lg gap-2 p-3 border-1",
                          "data-[selected=true]:border-primary",
                        ),
                        labelWrapper: "w-full",
                        label: "w-full ",
                      }}
                      value={payment.id}
                    >
                      <div className="flex w-full items-center gap-3">
                        <Image
                          className="object-contain"
                          height={60}
                          src={payment.logoUrl}
                          width={60}
                        />
                        <span className="text-sm font-semibold">
                          {payment.payName}
                        </span>
                      </div>
                    </Radio>
                  );
                })}
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 border-t-[1px] bg-white p-4">
          <p className="text-price-xl">PLN 714.84</p>
          <Button color="primary" size="lg">
            下单结算
          </Button>
        </div>
      </div>
    </div>
  );
}
