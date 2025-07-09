"use client";
import {
  Button,
  cn,
  Radio,
  RadioGroup,
  RadioProps,
  useRadio,
  VisuallyHidden,
  Image,
  addToast,
} from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoWallet } from "react-icons/io5";

import { useBillingAddressList, usePaymentMethodList } from "@/hook";
import { createPayOrder, getPayOrderStatus } from "@/services";
import CommonModal from "@/components/modal/common-modal";
import { useWalletStore } from "@/store";
const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex w-full flex-row items-center bg-white tap-highlight-transparent hover:bg-content2 active:opacity-50",
        "cursor-pointer gap-4 rounded-lg border-1 border-default p-4",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()} className="flex-1">
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};

export default function PayOrder() {
  const router = useRouter();
  const params = useParams<{ bizCode: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);
  const [paymentId, setPaymentId] = useState("");
  const wallet = useWalletStore((state) => state.wallet);

  const { data: billingAddressData } = useBillingAddressList();

  console.log("data", data);

  const hanldeCreatePayOrder = async () => {
    console.log("handleCreatePayOrder", paymentId);

    try {
      const url = await createPayOrder({
        bizCode: params.bizCode,
        paymentId,
        addressId: billingAddressData![0]?.id,
      });

      window.open(url, "_blank");
      setIsOpen(true);
    } catch (error) {}
  };
  const currentPayMethod = useMemo(() => {
    return (
      data
        ?.flatMap((item: any) => item.paymentList)
        .find((item: any) => item.id === paymentId) ?? {}
    );
  }, [paymentId]);

  useEffect(() => {
    if (data) {
      console.log(6666, data[0]?.paymentList[0]?.id);

      setPaymentId(data[0]?.paymentList[0]?.id);
    }
  }, [data]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="h-[calc(var(--vh)_*_100)] overflow-x-hidden bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        确定订单
      </NavBar>
      <div className="px-2">
        <div className="box-card p-2 text-center">
          <div className="text-sm text-[#999]">总计</div>
          <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
            {currentPayMethod?.payAmount}
          </div>
          <p className="">
            手续费：
            {currentPayMethod?.handlingFee}
          </p>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full flex-col gap-1">
            <RadioGroup
              classNames={{
                base: "w-full",
              }}
              value={paymentId}
              onValueChange={(value) => {
                setPaymentId(value);
              }}
            >
              {data?.map((item) => {
                if (item.methodName !== "BALANCE") return null;

                return (
                  <div
                    key={item.methodName}
                    className="rounded-2xl bg-[#ffeee1] p-4"
                  >
                    <p className="text-title">{item.methodName}</p>
                    {item.paymentList.map((payment) => {
                      if (payment.id === "1")
                        return (
                          <CustomRadio key={payment.id} value={payment.id}>
                            <div>
                              <div className="flex items-center justify-between px-1 py-2 text-sm">
                                <div className="flex items-center gap-4">
                                  <IoWallet className="h-14 w-14 text-[#f0700c]" />
                                  <div>余额 </div>
                                  <div className="">
                                    $ {wallet?.availabalBalance}
                                  </div>
                                </div>
                                <Button
                                  color="primary"
                                  // onPress={() => {
                                  //   setIsOpen(true);
                                  // }}
                                >
                                  充值
                                </Button>
                              </div>
                            </div>
                          </CustomRadio>
                        );

                      return null;
                    })}
                  </div>
                );
              })}
              {data?.map((item) => {
                if (item.methodName === "BALANCE") return null;

                return (
                  <div key={item.methodName}>
                    <p className="text-title">{item.methodName}</p>
                    {item.paymentList.map((payment) => {
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
                );
              })}
            </RadioGroup>
          </div>
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            defaultValue={"1"}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 border-t-[1px] bg-white p-4">
        <Button
          className="w-full"
          color="primary"
          size="lg"
          onPress={hanldeCreatePayOrder}
        >
          下单结算
        </Button>
      </div>
      <CommonModal
        cancelText="支付失败反馈"
        confirmText="已付"
        isOpen={isOpen}
        size="xl"
        title="遇到问题？"
        onConfirm={async (onClose) => {
          const status = await getPayOrderStatus(params?.bizCode);

          if (status === 203) {
            onClose();
          } else {
            addToast({
              title: "未完成支付",
              timeout: 1000,
              color: "danger",
            });
          }
        }}
        onOpenChange={setIsOpen}
      >
        <div>
          <div className="my-4 rounded-lg bg-[#ffeee1] p-2 text-sm">
            温馨提示：请在新页面完成支付，支付完成前请勿关闭此窗口。
          </div>
          <div className="mb-2 mt-5">如果您支付成功，请点击支付完成。</div>
          <div className="mb-5">
            如果您在付款时遇到问题，请重试或给我们一个{" "}
            <span className="text-blue-600">反馈</span>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
