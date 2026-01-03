"use client";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Snippet,
  Textarea,
  Image,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import { ImageViewer, NavBar, Stepper } from "antd-mobile";
import { useTranslation } from "react-i18next";

import { useGlobalStore } from "@/store";
import { createCustomizeOrder, getServicesList } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import CommonModal from "@/components/modal/common-modal";

export default function ForwardingPage() {
  const { t } = useTranslation("translation", { keyPrefix: "forwardingPage" });

  const [isLoading, setIsLoading] = useState(false);

  const { currency } = useGlobalStore();

  const [servicesList, setServicesList] = useState([]);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  // 弹窗状态
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getServicesList();

        // 克隆服务，初始化 isCheck、remark
        setServicesList(
          res.map((s: any) => {
            return {
              ...s,
              serviceId: s?.id,
              isCheck: false,
              remark: "",
              quantity: 1,
            };
          }),
        );
      } catch (err) {
        console.error("获取服务列表失败:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const payload = {
      logisticsCode: data.logisticsCode,
      packageItemName: data.packageItemName,
      serviceList: servicesList
        .filter((s: any) => s.isCheck)
        .map((item: any) => {
          return {
            serviceId: item.serviceId,
            quantity: item.quantity,
            remark: item.remark,
          };
        }),
      receiver: "Bryant-4-Bryant",
      receivePhone: "15916408071",
      receiveAddress: "广东省惠州市惠城区水口荔枝城青创产业园9楼901",
    };

    try {
      setLoading(true);
      const bizCode = await createCustomizeOrder(payload);

      if (bizCode) {
        router.push(`/payment?bizCode=${bizCode}`);
      } else {
        router.push("/profile/order");
      }
    } catch (err) {
      console.error("创建失败:", err);
    } finally {
      setLoading(false);
    }
  };
  // 保存服务详情备注
  const saveServiceDetail = () => {
    // 如果是基础拍照（id === 1），直接关掉弹窗，不修改 localServices
    if (currentService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }

    setServicesList((prev: any) =>
      prev.map((s: any) =>
        s.id === currentService.id
          ? {
              ...s,
              remark: currentService?.remark,
              isCheck: true,
              quantity: currentService?.quantity,
            }
          : s,
      ),
    );

    setIsServiceDetailOpen(false);
  };

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = servicesList.find((s: any) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };
  // 删除已选服务
  const removeService = (serviceId: string) => {
    setServicesList((prev: any) =>
      prev.map((s: any) =>
        s.id === serviceId ? { ...s, isCheck: false, remark: "" } : s,
      ),
    );
  };

  return (
    <>
      {isLoading && <FullscreenLoader />}

      {/* 顶部导航栏 - 与设置页保持一致 */}
      <NavBar onBack={() => router.push("/")}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-y-auto bg-[#f5f5f5]">
        {/* 顶部 Banner */}
        <div className="bg-[url('/images/estimation/bg.webp')] bg-center pt-[30%]" />
        <Form
          className="flex flex-col gap-4 p-4"
          id="form"
          onSubmit={handleSubmit}
        >
          {/* 地址块 */}
          <div className="space-y-2 rounded-xl bg-white p-4">
            <span className="text-base font-bold text-gray-900">
              {t("warehouseAddress")}
            </span>
            <Snippet
              classNames={{
                base: "bg-gray-50 border border-gray-100 rounded-lg p-3",
                pre: "break-words whitespace-pre-line text-sm text-gray-600 font-normal",
              }}
              symbol=""
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-900">
                  Bryant-4-Bryant
                </span>
                <span>15916408071</span>
                <span>广东省惠州市惠城区水口荔枝城青创产业园9楼901</span>
              </div>
            </Snippet>
          </div>

          {/* 包裹信息 */}
          <div className="w-full space-y-8 rounded-xl bg-white p-4">
            <div className="text-base font-bold text-gray-900">
              {t("forwardingPackage")}
            </div>
            <Input
              isRequired
              classNames={{
                label: "text-sm font-medium text-gray-700",
                input: "text-base",
                inputWrapper:
                  "bg-gray-50 border-gray-200 hover:border-gray-300 focus-within:!bg-white",
              }}
              errorMessage={t("errorTrackingNo")}
              label={t("trackingNo")}
              labelPlacement="outside"
              name="logisticsCode"
              placeholder={t("trackingNoPlaceholder")}
              type="text"
              variant="bordered"
            />
            <Input
              isRequired
              classNames={{
                label: "text-sm font-medium text-gray-700",
                input: "text-base",
                inputWrapper:
                  "bg-gray-50 border-gray-200 hover:border-gray-300 focus-within:!bg-white",
              }}
              errorMessage={t("errorPackageName")}
              label={t("packageName")}
              labelPlacement="outside"
              name="packageItemName"
              placeholder={t("packageNamePlaceholder")}
              type="text"
              variant="bordered"
            />
          </div>

          {/* 服务 */}
          <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-50 px-4 py-3">
              <span className="text-base font-bold text-gray-900">
                {t("extraServices")}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              {servicesList.map((service: any) => (
                <div
                  key={service.id}
                  className={`rounded-xl border transition-colors ${
                    service.isCheck
                      ? "border-[#f0700c] bg-orange-50/30"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <span className="font-medium text-gray-800">
                      {service.serviceName}
                    </span>
                    {service.id == 1 ? (
                      <button
                        className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 transition-colors active:scale-95"
                        type="button"
                        onClick={() => openServiceDetail(service.id)}
                      >
                        <FaCamera />
                        {t("free")}
                      </button>
                    ) : (
                      <Button
                        className={`h-7 min-w-[60px] rounded-full text-xs font-medium ${
                          service.isCheck
                            ? "bg-[#f0700c] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        size="sm"
                        type="button"
                        onPress={() => openServiceDetail(service.id)}
                      >
                        {t("add")}
                      </Button>
                    )}
                  </div>

                  {service.isCheck && service.id != 1 && (
                    <div className="mx-3 mb-3 flex items-center justify-between rounded-lg border border-[#f0700c]/20 bg-white px-3 py-2">
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        {service.remark ? (
                          <span className="truncate text-xs text-gray-500">
                            {t("remark")}: {service.remark}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">无备注</span>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-3 pl-2">
                        <span className="text-xs text-gray-500">
                          x{service.quantity}
                        </span>
                        <span className="text-sm font-bold text-[#f0700c]">
                          {currency.symbol}
                          {service.price}
                        </span>
                        <div
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-500 active:scale-90"
                          role="button"
                          onClick={() => removeService(service.id)}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 18L18 6M6 6l12 12"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Form>
      </div>

      {/* 底部吸底按钮 - 增加阴影和层级 */}
      <div className="flex flex-col gap-3 px-4 py-3 pb-[env(safe-area-inset-bottom)]">
        <Checkbox
          classNames={{
            label: "text-sm text-gray-600",
            wrapper: "before:border-gray-300",
          }}
          isSelected={acceptAgreement}
          size="sm"
          onValueChange={setAcceptAgreement}
        >
          {t("acceptAgreement")}
        </Checkbox>
        <Button
          className="h-11 w-full rounded-xl bg-[#f0700c] text-base font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]"
          form="form"
          isDisabled={!acceptAgreement || loading}
          isLoading={loading}
          type="submit"
        >
          {t("submit")}
        </Button>
      </div>

      {/* 服务详情弹窗 */}
      {currentService && (
        <CommonModal
          footer={visible && <div />}
          isDismissable={false}
          isOpen={isServiceDetailOpen}
          showCancel={currentService.id != 1}
          title={currentService.serviceName}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-5">
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
              {currentService.sample.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {t("sample")}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {currentService.sample.map((url: string, index: any) => (
                      <Image
                        key={url}
                        className="h-full w-full object-cover"
                        radius="none"
                        src={url}
                        onClick={() => {
                          setStartIndex(index); // 点击哪张图片就从哪张开始预览
                          setVisible(true);
                        }}
                      />
                    ))}
                  </div>
                  <ImageViewer.Multi
                    key={startIndex} // ★ 让组件强制重新创建
                    defaultIndex={startIndex} // 从点击的那张开始
                    images={currentService.sample}
                    visible={visible}
                    onClose={() => setVisible(false)}
                  />
                </div>
              )}
            </div>

            {/* 服务费（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <div className="flex items-center justify-between border-t pt-3">
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
                className="mt-2 w-full"
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
