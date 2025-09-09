"use client";

import { Button, Card } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

import { payNotice } from "@/services/wallet";

function formatTime(ts: string) {
  if (!ts) return "";
  const num = Number(ts);
  const ms = num < 1e12 ? num * 1000 : num; // 秒级转毫秒

  return new Date(ms).toLocaleString();
}

export default function PaymentResultPage() {
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
      // 如果是 WALLET 支付方式，则不通知后端
      if (payMethodCode === "WALLET") {
        setLoading(false);

        return;
      }

      try {
        await payNotice(searchParams.toString());
      } catch (err) {
        console.error("通知后端支付状态失败", err);
      } finally {
        setLoading(false);
      }
    }
    notifyBackend();
  }, [searchParams, payMethodCode]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg">
        正在确认支付结果...
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
              <h1 className="text-xl font-bold text-green-600">支付成功</h1>
              <div className="space-y-1 text-center text-sm text-gray-600">
                <p>交易号：{payOrderId}</p>
                <p>
                  支付金额：
                  {searchParams.get("currency") === "USD" ? "$" : "￥"}
                  {amount}
                </p>
                <p>支付时间：{formatTime(paySuccTime)}</p>
              </div>
              <p className="text-center text-xs text-gray-500">
                我们已收到您的付款，订单正在处理中。
              </p>
            </>
          ) : (
            <>
              <AiFillCloseCircle className="h-16 w-16 text-red-500" />
              <h1 className="text-xl font-bold text-red-600">支付失败</h1>
              <div className="space-y-1 text-center text-sm text-gray-600">
                <p>订单号：{payOrderId}</p>
                {amount && (
                  <p>
                    支付金额：
                    {searchParams.get("currency") === "USD" ? "$" : "￥"}
                    {amount}
                  </p>
                )}
                {paySuccTime && <p>支付时间：{formatTime(paySuccTime)}</p>}
              </div>
              <p className="text-center text-xs text-gray-500">
                支付未完成，请检查订单或重新尝试付款。
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
              查看订单
            </Button>
            <Button
              className="w-full"
              size="lg"
              onPress={() => router.push("/")}
            >
              返回首页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
