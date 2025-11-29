"use client";

import { Button, Card, Spinner } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useTranslations } from "next-intl"; // 新增

import { payNotice, payPaypel } from "@/services/wallet";
import { useGlobalStore } from "@/store";

function formatTime(ts: string) {
  if (!ts) return "";
  const num = Number(ts);
  const ms = num < 1e12 ? num * 1000 : num; // 秒级转毫秒

  return new Date(ms).toLocaleString();
}

/**
 * 汇率转换（金额 → 中间汇率A → 最终汇率B）
 * 返回保留两位小数的数字
 */
function convertCurrency(
  amount: number | string,
  rateA: number | string,
  rateB: number | string,
  digits = 2,
) {
  // 转成数字
  const numAmount = Number(amount);
  const numRateA = Number(rateA);
  const numRateB = Number(rateB);

  if (isNaN(numAmount) || isNaN(numRateA) || isNaN(numRateB)) {
    throw new Error(
      "amount and rates must be valid numbers or numeric strings",
    );
  }

  const scale = Math.pow(10, 6); // 提升精度，避免 JS 浮点误差

  // 原币 → 中间币（如 USD → RMB）
  const middle = Math.round(numAmount * numRateA * scale) / scale;

  // 中间币 → 目标币（如 RMB → EUR）
  const result = Math.round((middle / numRateB) * scale) / scale;

  // 最终保留指定小数位
  const finalScale = Math.pow(10, digits);

  return Math.round(result * finalScale) / finalScale;
}

export default function PaymentResultPage() {
  const t = useTranslations("payment.result"); // 使用翻译
  const { currency, currencies } = useGlobalStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isConvert, setIsConvert] = useState(false);

  const payToken = searchParams.get("token"); // PayPal

  const [paymentInfo, setPaymentInfo] = useState<{
    success: boolean;
    orderId?: string;
    amount?: number;
    payTime?: string;
    currency?: string;
  }>({ success: false, amount: 0 });

  useEffect(() => {
    // 初始化类型
    async function notifyBackend() {
      try {
        let paymentInfo;

        if (payToken) {
          console.log("走paypel");

          // PayPal: 用 token 请求后端
          const res = await payPaypel(searchParams.toString());

          paymentInfo = {
            success: res?.resultCode === "SUCCESS" || res?.status === "2",
            orderId: res?.payOrderId,
            amount: res?.amount,
            payTime: res?.paySuccTime,
            currency: res?.currency,
          };
          // paymentInfo = { success: true/false, orderId, amount, payTime, currency }
        } else {
          console.log("onpay/钱包");

          // 原支付方式: 用 URL 参数构造结果
          paymentInfo = {
            success:
              searchParams.get("resultCode") === "SUCCESS" ||
              searchParams.get("status") === "2",
            orderId: searchParams.get("payOrderId"),
            amount: searchParams.get("amount"),
            payTime: searchParams.get("paySuccTime"),
            currency: searchParams.get("currency"),
          };

          // 同步通知后端（非钱包支付）
          if (searchParams.get("payMethodCode") !== "WALLET") {
            await payNotice(searchParams.toString());
          }
        }
        console.log("paymentInfo", paymentInfo);

        setPaymentInfo(paymentInfo);
      } catch {
      } finally {
        setIsConvert(true);
      }
    }

    notifyBackend();
  }, []);

  useEffect(() => {
    if (currencies?.length && paymentInfo?.currency) {
      const rateFromToIntermediate = currencies.find(
        (item: any) => item.label == paymentInfo?.currency,
      )?.rate as number; // 从源币种到中间币种

      const rateIntermediateToTarget = currency?.rate; // 从中间币种到目标币种

      setPaymentInfo({
        ...paymentInfo,
        amount: convertCurrency(
          paymentInfo?.amount as number,
          rateFromToIntermediate,
          rateIntermediateToTarget,
        ),
      });
      setLoading(false);
    }
  }, [currencies, isConvert]);

  if (loading) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center text-lg">
        {t("loading")}
        <div className="mt-4">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card
        className={`w-full max-w-md rounded-2xl border p-6 shadow-sm ${
          paymentInfo?.success ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex flex-col items-center space-y-5">
          {/* 动态配置图标和标题 */}
          {paymentInfo?.success ? (
            <>
              <AiFillCheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-xl font-bold text-green-600">
                {t("successTitle")}
              </h1>
            </>
          ) : (
            <>
              <AiFillCloseCircle className="h-16 w-16 text-red-500" />
              <h1 className="text-xl font-bold text-red-600">
                {t("failTitle")}
              </h1>
            </>
          )}

          {/* 统一的信息展示组件 */}
          <div className="space-y-1 text-center text-sm text-gray-600">
            <p>
              {t("transactionId")} {paymentInfo?.orderId}
            </p>
            <p>
              {t("amount")}
              {currency.symbol}
              {paymentInfo?.amount}
            </p>
            {paymentInfo?.payTime && (
              <p>
                {t("time")}
                {formatTime(paymentInfo.payTime)}
              </p>
            )}
          </div>

          {/* 动态消息文本 */}
          <p className="text-center text-xs text-gray-500">
            {paymentInfo?.success ? t("successNotice") : t("failNotice")}
          </p>

          {/* 统一的按钮组 */}
          <div className="flex w-full flex-col gap-3 pt-4">
            <Button
              className="w-full"
              color="primary"
              size="lg"
              onPress={() => router.push(`/profile/order`)}
            >
              {t("viewOrder")}
            </Button>
            <Button
              className="w-full"
              size="lg"
              onPress={() => router.push("/")}
            >
              {t("backHome")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
