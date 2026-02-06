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
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { IoWallet } from "react-icons/io5";

import {
  useBillingAddressActions,
} from "@/hook/business";
import { useBillingAddress, } from "@/hook/api";

import { useWalletInfo, usePaymentMethodList } from "@/hook/api";
import { createPayOrder } from "@/services";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import BillingAddress from "@/components/block/billing-address";
import BillingAddressModal from "@/components/modal/billing-address-modal";
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
  const t = useTranslations("payment");
  const { currency } = useGlobalStore();
  const router = useRouter();
  const params = useParams<{ bizCode: string }>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: billingAddress } = useBillingAddress();

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);

  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useWalletInfo();

  const [paymentId, setPaymentId] = useState("");

  const { modalState, handleOpenChange, handleAddClick, handleEditClick } =
    useBillingAddressActions();

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

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 scrollbar-hide">
        <div className="box-card space-y-2 p-3 text-center">
          <div className="text-sm tracking-wide text-gray-500">
            {t("total")}
          </div>
          <div className="text-balance">
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
              <BillingAddress
                key={billingAddress.id}
                addressDetail={billingAddress}
                showDeleteButton={false}
                onAdd={handleAddClick}
                onEdit={handleEditClick}
              />
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
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 border-t-[1px] bg-white p-4">
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
      <BillingAddressModal
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
