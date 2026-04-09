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

import SelectionCouponDrawer from "./selection-coupon-drawer";
import { CommonDrawer } from "@/components/drawer";

import { useBillingAddressActions } from "@/hook/business";
import { useBillingAddress, usePay } from "@/hook/api";
import { useWalletInfo, usePaymentMethodList } from "@/hook/api";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import BillingAddress from "@/components/block/billing-address";
import { EditBillingAddressDrawer } from "@/components/drawer";
import SelectionBlock from "@/components/common/selection-block";
import { CouponItem } from "@/components/item-list";

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
  const [confirmedCouponId, setConfirmedCouponId] = useState<
    string | undefined
  >(undefined);
  const { data: billingAddress } = useBillingAddress();
  const { data, isLoading, isFetching } = usePaymentMethodList({
    bizCode: params.bizCode,
    customerCouponId: confirmedCouponId,
  });

  console.log("data", data);

  const { pay, isPayFetching } = usePay();
  const paymentList = useMemo(() => data?.paymentAndFeeList || [], [data]);
  const couponList = useMemo(() => data?.customerCouponList || [], [data]);
  const { data: wallet } = useWalletInfo();

  const [paymentId, setPaymentId] = useState("");
  const [showCouponDrawer, setShowCouponDrawer] = useState(false);
  const [showPaypalWarning, setShowPaypalWarning] = useState(false);

  const { modalState, handleOpenChange, handleAddClick, handleEditClick } =
    useBillingAddressActions();

  /** 判断当前选中的支付方式是否为 PAYPAL */
  const isPaypalSelected = useMemo(() => {
    return paymentList?.some(
      (item: any) =>
        item.methodName === "PAYPAL" &&
        item.paymentList?.some((p: any) => p.id === paymentId),
    );
  }, [paymentId, paymentList]);

  const doSubmitPay = () => {
    pay({
      bizCode: params.bizCode,
      paymentId,
      addressId: billingAddress?.id as string,
      customerCouponId: selectedCoupon?.id,
    });
  };

  const hanldeCreatePayOrder = async () => {
    if (paymentId !== "1" && !billingAddress?.id) {
      addToast({
        title: "Please add billing address",
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    // 如果选的是 PayPal，先弹出警告抽屉
    if (isPaypalSelected) {
      setShowPaypalWarning(true);
      return;
    }
    doSubmitPay();
  };
  const currentPayMethod = useMemo(() => {
    return (
      paymentList
        ?.flatMap((item: any) => item.paymentList)
        .find((item: any) => item.id === paymentId) ?? {}
    );
  }, [paymentId, paymentList]);

  useEffect(() => {
    if (!paymentId && paymentList?.length > 0) {
      const firstPayment = paymentList[0]?.paymentList?.[0];

      if (firstPayment?.id) {
        setPaymentId(firstPayment.id);
      }
    }
  }, [paymentList, paymentId]);

  const selectedCoupon = useMemo(() => {
    return couponList.find((c: any) => c.id === confirmedCouponId);
  }, [couponList, confirmedCouponId]);

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
          <SelectionBlock
            emptyText={t("selectCoupon")}
            isEmpty={!selectedCoupon}
            title={t("coupon")}
            onClick={() => setShowCouponDrawer(true)}
          >
            {selectedCoupon && <CouponItem coupon={selectedCoupon} />}
          </SelectionBlock>

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
              {paymentList.map((item: any) => (
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
          isLoading={isPayFetching}
          size="lg"
          onPress={hanldeCreatePayOrder}
        >
          {t("submit")}
        </Button>
      </div>
      <EditBillingAddressDrawer
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      />
      <SelectionCouponDrawer
        couponList={couponList}
        isOpen={showCouponDrawer}
        selectedCouponId={confirmedCouponId}
        onOpenChange={setShowCouponDrawer}
        onSelect={(coupon) => setConfirmedCouponId(coupon.id)}
      />
      <CommonDrawer
        isOpen={showPaypalWarning}
        title={t("paypalWarning.title")}
        confirmText={t("submit")}
        onOpenChange={setShowPaypalWarning}
        onConfirm={() => {
          setShowPaypalWarning(false);
          doSubmitPay();
        }}
      >
        <p className="text-sm leading-relaxed text-gray-700">
          {t("paypalWarning.content")}
        </p>
      </CommonDrawer>
    </>
  );
}
