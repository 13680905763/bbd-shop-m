"use client";
import { ImageViewer, NavBar, Stepper } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Textarea,
  Image,
  useDisclosure,
} from "@heroui/react";
import { FaCamera } from "react-icons/fa";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import {
  createOrderByCart,
  createOrderByProduct,
  getServicesList,
  updateOrderPreviewCart,
  updateOrderPreviewProduct,
} from "@/services";
import { useOrderPreview } from "@/hook";
import { createOrderPreviewKeyByProductParams } from "@/types";
import { useGlobalStore } from "@/store";
import CommonModal from "@/components/modal/common-modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function SubmitOrder() {
  const t = useTranslations("submit.order");
  const { currency } = useGlobalStore();

  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;
  const { data, isLoading, isError } = useOrderPreview(type, key);
  const [orderData, setOrderData] = useState<any>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleCartSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (type === "cart") {
      const bizCode = await createOrderByCart(orderData?.param);

      router.push("/payment/" + bizCode);
    } else if (type === "product") {
      const bizCode = await createOrderByProduct(
        orderData?.param as createOrderPreviewKeyByProductParams,
      );

      router.push("/payment/" + bizCode);
    }
    setSubmitting(false);
  };

  // 附加服务
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visible, setVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [servicesList, setServicesList] = useState([]);

  // 本地状态：存储克隆的服务列表，用于单商品
  const [localServices, setLocalServices] = useState<any[]>([]);

  // 弹窗状态
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 当前操作的商品ID
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);

  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);

  // 打开商品服务列表弹窗
  const openServiceModal = (cartId: string, skuId: string) => {
    setCurrentCartId(cartId);
    const handleSO = orderData?.orderList?.find((item: any) => {
      return item?.products.find((iitem: any) => {
        return iitem?.propAndValue?.propId_valueId == skuId;
      });
    });

    const hanldeSer =
      handleSO.products
        .find((item: any) => {
          return item?.propAndValue?.propId_valueId == skuId;
        })
        ?.orderServiceList?.map((item: any) => {
          return {
            id: item?.id,
            quantity: item?.quantity || 1,
            remark: item?.remark || "",
          };
        }) || [];

    // 克隆服务，初始化 isCheck、remark
    setLocalServices(
      servicesList.map((s: any) => {
        return {
          ...s,
          isCheck: hanldeSer.find((item: any) => item.id == s.id)
            ? true
            : false,
          remark: "",
          quantity:
            hanldeSer.find((item: any) => item.id == s.id)?.quantity || 1,
        };
      }),
    );
    onOpen();
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
          ? {
              ...s,
              remark: currentService.remark,
              isCheck: true,
              quantity: currentService?.quantity,
            }
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
    if (!currentCartId) return;

    const checkedServices = localServices
      .filter((s) => s.isCheck)
      .map((s) => ({
        serviceId: s.id,
        remark: s.remark,
        quantity: s.quantity,
      }));

    try {
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
    } catch (err) {
      addToast({ title: "提交失败", color: "danger" });
    } finally {
    }
  };

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getServicesList();

        setServicesList(res);
      } catch {}
    };

    fetchData();
  }, []);

  if (isError) return <div>出错了</div>;

  return (
    <>
      {/* 顶部导航 */}
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      {isLoading && <FullscreenLoader />}
      {/* 中间可滚动商品列表 */}
      <div className="flex-1 overflow-auto p-2">
        {orderData?.orderList?.map((order: any) => (
          <OrderItem
            key={order?.shopName}
            openServiceModal={openServiceModal}
            order={order}
          />
        ))}
      </div>

      {/* 底部费用汇总 & 提交按钮 */}
      <div className="sticky bottom-0 z-10 w-full border-t bg-white px-4 py-3">
        <div className="mb-3 flex flex-col gap-2">
          {/* 总计 */}
          <div className="flex justify-between pt-2 text-base font-bold text-gray-900">
            <span>{t("total")}</span>
            <span>
              {currency.symbol}
              {togglePrice}
            </span>
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
          {t("submitOrder")}
        </Button>
      </div>

      {/* 商品服务列表弹窗 */}
      <CommonModal
        isOpen={isOpen}
        title={t("valueAddedService")}
        onConfirm={handleServiceSubmit}
        onOpenChange={onOpenChange}
      >
        {localServices.map((service) => (
          <div key={service.id} className="items-center rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{service.serviceName}</div>
              {service.id == 1 ? (
                // 免费的 icon
                <button
                  className="flex h-8 w-16 items-center justify-center gap-1 text-sm text-green-500"
                  onClick={() => openServiceDetail(service.id)}
                >
                  <FaCamera />
                  {t("free")}
                </button>
              ) : (
                <Button
                  className="button-white"
                  size="sm"
                  onPress={() => openServiceDetail(service.id)}
                >
                  {t("add")}
                </Button>
              )}
            </div>

            {service.isCheck && service.id != 1 && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {/* {t("serviceItem")} */}
                  </span>
                  <span className="mt-0.5 truncate text-[11px] text-gray-400">
                    {t("remark")}: {service.remark}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-500">
                    {currency.symbol}
                    {service.price}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    x{service.quantity}
                  </span>

                  <Button
                    className="h-6 px-2 text-[11px]"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeService(service.id)}
                  >
                    {t("delete")}
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
          isDismissable={false}
          isOpen={isServiceDetailOpen}
          showCancel={currentService.id != 1}
          title={currentService.serviceName}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-4">
            {/* 服务介绍 */}
            <div className="space-y-4 rounded-lg bg-[#f8f8f8] p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {t("serviceIntro")}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {currentService.introduction || t("noIntro")}
                </p>
              </div>

              {/* 示例（id != 1 时才展示） */}
              {currentService?.sample.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {t("sample")}
                  </h3>

                  <div className="grid grid-cols-4 gap-2">
                    {currentService?.sample.map((url: string, index: any) => (
                      <Image
                        key={url}
                        className="h-full w-full object-cover"
                        radius="none"
                        src={url}
                        onClick={() => {
                          setStartIndex(index); // 点击哪张图片就从哪张开始预览
                          setTimeout(() => {
                            setVisible(true);
                          }, 200);
                        }}
                      />
                    ))}
                  </div>
                  <ImageViewer.Multi
                    key={startIndex} // ★ 让组件强制重新创建
                    defaultIndex={startIndex} // 从点击的那张开始
                    images={currentService?.sample}
                    visible={visible}
                    onClose={() => setVisible(false)}
                  />
                </div>
              )}
            </div>

            {/* 服务费（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{t("serviceFee")}</span>
                <div className="flex gap-2">
                  <span className="text-lg font-semibold text-rose-600">
                    {currency.symbol}
                    {currentService.price}
                  </span>
                  {currentService?.stacked == 1 ? (
                    <Stepper
                      value={currentService?.quantity}
                      onChange={(quantity) => {
                        setCurrentService({
                          ...currentService,
                          quantity: quantity,
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            )}

            {/* 备注输入框（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <Textarea
                className="w-full"
                classNames={{
                  input: "text-base",
                }}
                minRows={3}
                placeholder={t("remarkPlaceholder")}
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
    </>
  );
}
