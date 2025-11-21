"use client";

import { Button, Card } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useTranslations } from "next-intl"; // 新增

import { payNotice } from "@/services/wallet";
import { useGlobalStore } from "@/store";

function formatTime(ts: string) {
  if (!ts) return "";
  const num = Number(ts);
  const ms = num < 1e12 ? num * 1000 : num; // 秒级转毫秒

  return new Date(ms).toLocaleString();
}

export default function PaymentResultPage() {
  const t = useTranslations("payment.result"); // 使用翻译
  const { currency } = useGlobalStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const payOrderId = searchParams.get("payOrderId") || "";
  const amount = searchParams.get("amount") || "0.00";
  const paySuccTime = searchParams.get("paySuccTime") || "";
  const resultCode = searchParams.get("resultCode");
  const status = searchParams.get("status");
  const payMethodCode = searchParams.get("payMethodCode"); // 新增

  const isSuccess = useMemo(() => {
    if (resultCode) return resultCode === "SUCCESS";
    if (status) return status === "2";

    return false;
  }, [resultCode, status]);

  useEffect(() => {
    async function notifyBackend() {
      try {
        if (payMethodCode !== "WALLET") {
          await payNotice(searchParams.toString());
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    notifyBackend();
  }, [searchParams, payMethodCode]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card
        className={`w-full max-w-md rounded-2xl border p-6 shadow-sm ${
          isSuccess ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex flex-col items-center space-y-5">
          {isSuccess ? (
            <>
              <AiFillCheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-xl font-bold text-green-600">
                {t("successTitle")}
              </h1>
              <div className="space-y-1 text-center text-sm text-gray-600">
                <p>
                  {t("transactionId")} {payOrderId}
                </p>
                <p>
                  {t("amount")}
                  {currency.symbol}
                  {amount}
                </p>
                <p>
                  {t("time")} {formatTime(paySuccTime)}
                </p>
              </div>
              <p className="text-center text-xs text-gray-500">
                {t("successNotice")}
              </p>
            </>
          ) : (
            <>
              <AiFillCloseCircle className="h-16 w-16 text-red-500" />
              <h1 className="text-xl font-bold text-red-600">
                {t("failTitle")}
              </h1>
              <div className="space-y-1 text-center text-sm text-gray-600">
                <p>
                  {t("transactionId")} {payOrderId}
                </p>
                {amount && (
                  <p>
                    {t("amount")}
                    {searchParams.get("currency") === "USD" ? "$" : "￥"}
                    {amount}
                  </p>
                )}
                {paySuccTime && (
                  <p>
                    {t("time")} {formatTime(paySuccTime)}
                  </p>
                )}
              </div>
              <p className="text-center text-xs text-gray-500">
                {t("failNotice")}
              </p>
            </>
          )}

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
