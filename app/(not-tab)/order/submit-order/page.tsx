"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { addToast, Button, Textarea, Image } from "@heroui/react";
import { FaCamera } from "react-icons/fa";

import OrderCard from "./order-card";

import {
  createOrderByCart,
  createOrderByProduct,
  updateOrderPreviewCart,
  updateOrderPreviewProduct,
} from "@/services";
import { useOrderPreview } from "@/hook";
import { createOrderPreviewKeyByProductParams } from "@/types";
import { useServicesStore } from "@/store";
import CommonModal from "@/components/modal/common-modal";

export type Product = {
  id: string;
  productTitle: string;
  sku: {
    propName_valueName: string;
  };
  skuPicUrl: string;
  remark?: string;
  totalPrice: number;
  price: number;
  postFee: number;
  quantity: number;
  source: string;
  sourceProductId: string;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;
  const { data, isLoading, isError } = useOrderPreview(type, key);
  const [orderData, setOrderData] = useState<any>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const services = useServicesStore((state) => state.services);

  const handleCartSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (type === "cart") {
      const bizCode = await createOrderByCart(orderData?.param);

      router.push("/order/pay-order/" + bizCode);
    } else if (type === "product") {
      const bizCode = await createOrderByProduct(
        orderData?.param as createOrderPreviewKeyByProductParams,
      );

      router.push("/order/pay-order/" + bizCode);
    }
    setSubmitting(false);
  };

  // 本地状态：存储克隆的服务列表，用于单商品
  const [localServices, setLocalServices] = useState<any[]>([]);

  // 弹窗状态
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 当前操作的商品ID
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);

  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);
  // 新增状态
  const [isServiceSubmitting, setIsServiceSubmitting] = useState(false);
  // 打开商品服务列表弹窗
  const openServiceModal = (cartId: string) => {
    console.log("services", services);

    setCurrentCartId(cartId);
    // 克隆服务，初始化 isCheck、remark
    setLocalServices(
      services.map((s: any) => ({
        ...s,
        isCheck: false,
        remark: "",
      })),
    );
    setIsServiceListOpen(true);
  };

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = localServices.find((s) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };

  // 保存服务详情备注
  const saveServiceDetail = () => {
    // 如果是基础拍照（id === 1），直接关掉弹窗，不修改 localServices
    if (currentService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }

    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === currentService.id
          ? { ...s, remark: currentService.remark, isCheck: true }
          : s,
      ),
    );
    setIsServiceDetailOpen(false);
  };

  // 删除已选服务
  const removeService = (serviceId: string) => {
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, isCheck: false, remark: "" } : s,
      ),
    );
  };

  // 修改 handleServiceSubmit
  const handleServiceSubmit = async () => {
    console.log("currentCartId", currentCartId);

    if (!currentCartId) return;

    const checkedServices = localServices
      .filter((s) => s.isCheck)
      .map((s) => ({ serviceId: s.id, remark: s.remark }));

    console.log("checkedServices", checkedServices);

    try {
      setIsServiceSubmitting(true); // ✅ 开始 loading
      let res;

      if (type === "cart") {
        res = await updateOrderPreviewCart({
          ...orderData.param,
          previewList: orderData.param.previewList.map((item: any) =>
            item.cartId === currentCartId
              ? { ...item, serviceList: checkedServices }
              : item,
          ),
        });
      } else {
        res = await updateOrderPreviewProduct({
          ...orderData.param,
          serviceList: checkedServices,
        });
      }

      setOrderData(res);
      setIsServiceListOpen(false);
    } catch (err) {
      addToast({ title: "提交失败", color: "danger" });
    } finally {
      setIsServiceSubmitting(false); // ✅ 结束 loading
    }
  };
  const toggleProductFee = useMemo(() => {
    const totalCents =
      orderData?.orderList?.reduce(
        (sum: number, item: any) =>
          sum + Math.round(Number(item?.productFee || 0) * 100),
        0,
      ) || 0;

    return totalCents / 100;
  }, [orderData]);
  const toggleServiceFee = useMemo(() => {
    const totalCents =
      orderData?.orderList?.reduce(
        (sum: number, item: any) =>
          sum + Math.round(Number(item?.serviceFee || 0) * 100),
        0,
      ) || 0;

    return totalCents / 100;
  }, [orderData]);
  const togglePostFee = useMemo(() => {
    const totalCents =
      orderData?.orderList?.reduce(
        (sum: number, item: any) =>
          sum + Math.round(Number(item?.postFee || 0) * 100),
        0,
      ) || 0;

    return totalCents / 100;
  }, [orderData]);
  const togglePrice = useMemo(() => {
    const totalCents =
      orderData?.orderList?.reduce(
        (sum: number, item: any) =>
          sum + Math.round(Number(item?.totalFee || 0) * 100),
        0,
      ) || 0;

    return totalCents / 100;
  }, [orderData]);

  useEffect(() => {
    if (data) setOrderData(data);
  }, [data]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
      {/* 顶部导航 */}
      <NavBar className="bg-white" onBack={() => router.back()}>
        订单支付
      </NavBar>

      {/* 中间可滚动商品列表 */}
      <div className="flex-1 overflow-auto p-2">
        {orderData?.orderList?.map((order: any) => (
          <OrderCard
            key={order?.shopName}
            openServiceModal={openServiceModal}
            order={order}
          />
        ))}
      </div>

      {/* 底部费用汇总 & 提交按钮 */}
      <div className="sticky bottom-0 z-10 w-full border-t bg-white px-4 py-3">
        <div className="mb-3 flex flex-col gap-2">
          {/* 单行费用展示 */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>商品价格</span>
            <span>{toggleProductFee}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>国内快递费</span>
            <span>{togglePostFee}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>服务费</span>
            <span>{toggleServiceFee}</span>
          </div>

          {/* 总计 */}
          <div className="flex justify-between border-t pt-2 text-base font-bold text-gray-900">
            <span>总计</span>
            <span>{togglePrice}</span>
          </div>
        </div>

        {/* 提交按钮 */}
        <Button
          className="w-full rounded-lg text-lg"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={handleCartSubmit}
        >
          提交订单
        </Button>
      </div>

      {/* 商品服务列表弹窗 */}
      <CommonModal
        confirmText="提交"
        isLoading={isServiceSubmitting}
        isOpen={isServiceListOpen}
        size="xl"
        title="增值服务"
        onConfirm={handleServiceSubmit}
        onOpenChange={setIsServiceListOpen}
      >
        {localServices.map((service) => (
          <div
            key={service.id}
            className="mb-4 items-center rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{service.serviceName}</div>
              {service.id == 1 ? (
                // 免费的 icon
                <button
                  className="flex items-center gap-1 text-sm text-green-500"
                  onClick={() => openServiceDetail(service.id)}
                >
                  <FaCamera className="mr-1" />
                  免费
                </button>
              ) : (
                <Button
                  className="button-white"
                  size="sm"
                  onPress={() => openServiceDetail(service.id)}
                >
                  添加
                </Button>
              )}
            </div>

            {service.isCheck && service.id != 1 && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    服务项
                  </span>
                  {service.remark && (
                    <span className="mt-0.5 truncate text-[11px] text-gray-400">
                      备注：{service.remark}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-500">x1</span>
                  <span className="text-sm font-semibold text-red-500">
                    ￥{service.price}
                  </span>
                  <Button
                    className="h-6 px-2 text-[11px]"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeService(service.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CommonModal>

      {/* 服务详情弹窗 */}
      {currentService && (
        <CommonModal
          key={currentService.id}
          confirmText={currentService.id != 1 ? "保存" : "确认"}
          isOpen={isServiceDetailOpen}
          showCancel={currentService.id != 1}
          size="xl"
          title={currentService.serviceName}
          onCancel={() => setIsServiceDetailOpen(false)}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-5">
            {/* 服务介绍 */}
            <div className="space-y-4 rounded-lg bg-[#f8f8f8] p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">服务介绍</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {currentService.introduction || "暂无介绍"}
                </p>
              </div>

              {/* 示例（id != 1 时才展示） */}
              {currentService.sample && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">示例</h3>
                  <Image
                    alt="服务示例"
                    className="border border-gray-200"
                    height={80}
                    radius="md"
                    src={currentService.sample}
                    width={80}
                  />
                </div>
              )}
            </div>

            {/* 服务费（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-700">服务费</span>
                <span className="text-lg font-semibold text-rose-600">
                  {currentService.price}
                </span>
              </div>
            )}

            {/* 备注输入框（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <Textarea
                className="mt-2 w-full"
                minRows={3}
                placeholder="请输入备注（选填）"
                value={currentService.remark}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    remark: e.target.value,
                  })
                }
              />
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
