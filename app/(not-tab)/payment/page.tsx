"use client";
import {
  Button,
  cn,
  RadioGroup,
  addToast,
  Radio,
  Image,
  VisuallyHidden,
  useRadio,
  RadioProps,
} from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoWallet } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import BillingAddress from "./component/billing-address";

import { useBillingAddressList, usePaymentMethodList } from "@/hook";
import { createPayOrder } from "@/services";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { getWalletInfo } from "@/services/wallet";
// 自定义 Radio 组件
const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
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
        "group inline-flex w-full cursor-pointer flex-row items-center gap-4 rounded-lg border-1 border-default bg-white p-4 tap-highlight-transparent",
        "hover:bg-content2 active:opacity-50",
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

// 余额支付选项
const BalancePayment = ({ payment, wallet, onRecharge, t }: any) => {
  const { currency } = useGlobalStore();

  return (
    <CustomRadio value={payment.id}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <IoWallet className="h-12 w-12 text-[#f0700c]" />
          <span className="text-xl font-bold text-[#333]">
            {currency.symbol}
            {wallet?.availabalBalance}
          </span>
        </div>
        <Button color="primary" size="sm" onPress={onRecharge}>
          {t("recharge")}
        </Button>
      </div>
    </CustomRadio>
  );
};

// 其他支付方式选项
const OtherPayment = ({ payment }: any) => (
  <Radio
    classNames={{
      base: cn(
        "inline-flex min-w-[100%] w-full bg-content1 m-0 mb-2 hover:bg-content2 items-center justify-start",
        "cursor-pointer rounded-lg gap-2 p-3 border-1",
        "data-[selected=true]:border-primary",
      ),
      labelWrapper: "w-full",
      label: "w-full",
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
      <span className="text-sm font-semibold">{payment.payName}</span>
    </div>
  </Radio>
);

export default function PayOrder() {
  const { t } = useTranslation("translation", {
    keyPrefix: "payment",
  });
  const { currency } = useGlobalStore();
  const router = useRouter();
  const params = Object.fromEntries(useSearchParams().entries());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: billingAddress } = useBillingAddressList();

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);
  const [loading, setLoading] = useState(true);

  const [wallet, setWallet] = useState<any>(null);
  const [paymentId, setPaymentId] = useState("");

  // 获取钱包信息
  const fetchWallet = async () => {
    try {
      const res = await getWalletInfo();

      setWallet(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);
  const hanldeCreatePayOrder = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (paymentId !== "1" && !billingAddress[0]?.id) {
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
        addressId: billingAddress[0]?.id as string,
      });

      if (typeof res === "string") {
        // 判断是否是 URL
        if (res.startsWith("http")) {
          // 跳转第三方支付页面
          window.location.href = res;
        }
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };
  const currentPayMethod = useMemo(() => {
    return (
      data
        ?.flatMap((item: any) => item.paymentList)
        .find((item: any) => item.id === paymentId) ?? {}
    );
  }, [paymentId]);
  // 排序：余额支付放前面
  const sortedData = useMemo(() => {
    if (!data) return [];
    const balance = data.filter((item: any) => item.methodName === "BALANCE");
    const others = data.filter((item: any) => item.methodName !== "BALANCE");

    return [...balance, ...others];
  }, [data]);

  useEffect(() => {
    if (sortedData.length) {
      const firstPayment = sortedData.flatMap(
        (item: any) => item.paymentList,
      )[0];

      if (firstPayment) setPaymentId(firstPayment.id);
    }
  }, [sortedData]);
  useEffect(() => {
    if (data) {
      setPaymentId(data[0]?.paymentList[0]?.id);
    }
  }, [data]);

  return (
    <>
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>
      {(isLoading || loading) && <FullscreenLoader />}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f5f5] p-2">
        <div className="box-card space-y-2 p-3 text-center">
          <div className="text-sm tracking-wide text-gray-500">
            {t("total")}
          </div>
          <div className="text-3xl font-extrabold leading-tight text-[#f0700c]">
            {currency.symbol}
            {currentPayMethod?.payAmount}
          </div>
          <p className="text-sm text-gray-600">
            {t("handlingFee")}
            <span className="font-medium">
              {currency.symbol}
              {currentPayMethod?.handlingFee}
            </span>
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
              classNames={{ base: "w-full" }}
              value={paymentId}
              onValueChange={setPaymentId}
            >
              {sortedData.map((item: any) => (
                <div
                  key={item.methodName}
                  className={
                    item.methodName === "BALANCE"
                      ? "mb-4 rounded-2xl bg-[#ffeee1] p-4"
                      : "mb-4"
                  }
                >
                  <p className="text-title">{item.methodName}</p>
                  {item.paymentList.map((payment: any) =>
                    item.methodName === "BALANCE" ? (
                      <BalancePayment
                        key={payment.id}
                        payment={payment}
                        t={t}
                        wallet={wallet}
                        onRecharge={() => router.push("/wallet")}
                      />
                    ) : (
                      <OtherPayment key={payment.id} payment={payment} />
                    ),
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 border-t-[1px] bg-white p-4 pb-[env(safe-area-inset-bottom)]">
        <Button
          className="w-full"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={hanldeCreatePayOrder}
        >
          {t("submit")}
        </Button>
      </div>
    </>
  );
}
