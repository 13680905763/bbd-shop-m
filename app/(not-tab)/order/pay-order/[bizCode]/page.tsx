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
import { useTranslations } from "next-intl";

import BillingAddress from "./billing-address";

import { useBillingAddressList, usePaymentMethodList } from "@/hook";
import { createPayOrder } from "@/services";
import { useBillingAddressStore, useWalletStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
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
  const t = useTranslations("PayOrder"); // ✅ 命名空间

  const router = useRouter();
  const params = useParams<{ bizCode: string }>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);
  const [paymentId, setPaymentId] = useState("");
  const wallet = useWalletStore((state) => state.wallet);

  const { data: billingAddressData } = useBillingAddressList();

  const billingAddress = useBillingAddressStore(
    (state) => state.billingAddress,
  );
  const hanldeCreatePayOrder = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (paymentId !== "1" && !billingAddress?.id) {
      addToast({
        title: "Please add billing address",
        timeout: 1000,
        color: "danger",
      });
      setSubmitting(false);

      return;
    }

    try {
      const res = await createPayOrder({
        bizCode: params.bizCode,
        paymentId,
        addressId: billingAddress?.id as string,
      });

      setSubmitting(false);

      if (typeof res === "string") {
        // 判断是否是 URL
        if (res.startsWith("http")) {
          // 跳转第三方支付页面
          window.location.href = res;
          // setIsOpen1(true);
          // 或者直接重定向
          // window.location.href = res.data;
        }
      }
    } catch (err) {
      setSubmitting(false);
      console.log(err);
    }
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
      setPaymentId(data[0]?.paymentList[0]?.id);
    }
  }, [data]);

  {
    isLoading && <FullscreenLoader />;
  }
  if (isError) return <div>加载失败</div>;

  return (
    <div className="h-[calc(var(--vh)_*_100)] overflow-x-hidden bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>
      <div className="px-2">
        <div className="box-card space-y-2 p-3 text-center">
          <div className="text-sm tracking-wide text-gray-500">
            {t("total")}
          </div>
          <div className="text-3xl font-extrabold leading-tight text-[#f0700c]">
            {currentPayMethod?.payAmount}
          </div>
          <p className="text-sm text-gray-600">
            {t("handlingFee")}
            <span className="font-medium">{currentPayMethod?.handlingFee}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-1">
          {paymentId !== "1" ? (
            <div className="bg-white p-4">
              <p className="text-title mb-2">{t("billingAddress")}</p>
              <BillingAddress billingAddress={billingAddress} />
            </div>
          ) : null}
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
          isLoading={submitting}
          size="lg"
          onPress={hanldeCreatePayOrder}
        >
          {t("placeOrder")}
        </Button>
      </div>
    </div>
  );
}
