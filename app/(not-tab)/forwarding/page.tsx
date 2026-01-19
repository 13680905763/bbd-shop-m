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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import { ImageViewer, NavBar, Stepper } from "antd-mobile";

import { useGlobalStore } from "@/store";
import { createCustomizeOrder, getServicesList } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import CommonModal from "@/components/modal/common-modal";

export default function ForwardingPage() {
  const t = useTranslations("forwardingPage");
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
      receivePhone: "13602579223",
      receiveAddress: "中国广东省惠州市水口街道荔城工业园胜豪科技大厦8A-801",
    };

    try {
      setLoading(true);
      const bizCode = await createCustomizeOrder(payload);

      if (bizCode) {
        router.push("/payment/" + bizCode);
      } else {
        router.push("/dashboard/order");
      }
    } catch (err) {
      console.error("创建失败:", err);
    } finally {
      setLoading(false);
    }
  };
  // 保存服务详情备注
  const saveServiceDetail = () => {
    console.log("currentService", currentService);

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
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto">
        <div className="h-[120px] bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-cover bg-no-repeat" />
        <Form
          className="flex flex-col gap-4 p-4"
          id="form"
          onSubmit={handleSubmit}
        >
          {/* 地址块 */}
          <div className="w-full rounded-lg bg-white p-4">
            <p className="mb-3 text-lg font-semibold">
              {t("warehouseAddress")}
            </p>
            <Snippet
              classNames={{
                pre: "break-words whitespace-pre-line text-base text-gray-700",
              }}
              symbol=""
            >
              <span>Bryant-4-Bryant</span>
              <span>15916408071</span>
              <span>广东省惠州市惠城区水口荔枝城青创产业园9楼901</span>
            </Snippet>
          </div>

          {/* 包裹信息 */}
          <div className="w-full rounded-lg bg-white p-4">
            <p className="mb-3 text-lg font-semibold">
              {t("forwardingPackage")}
            </p>

            <div className="flex flex-col gap-4">
              <Input
                isRequired
                classNames={{
                  input: "text-base",
                }}
                errorMessage={t("errorTrackingNo")}
                label={t("trackingNo")}
                labelPlacement="outside"
                name="logisticsCode"
                placeholder={t("trackingNoPlaceholder")}
                type="text"
              />

              <Input
                isRequired
                classNames={{
                  input: "text-base",
                }}
                errorMessage={t("errorPackageName")}
                label={t("packageName")}
                labelPlacement="outside"
                name="packageItemName"
                placeholder={t("packageNamePlaceholder")}
                type="text"
              />
            </div>
          </div>

          {/* 服务 */}
          <div className="flex w-full flex-col gap-2 rounded-lg bg-white p-4">
            <p className="mb-3 text-lg font-semibold">{t("extraServices")}</p>
            {servicesList.map((service: any) => (
              <div
                key={service.id}
                className="items-center rounded-lg border p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{service.serviceName}</div>
                  {service.id == 1 ? (
                    // 免费的 icon
                    <button
                      className="flex h-8 w-16 items-center justify-center gap-1 text-sm text-green-500"
                      type="button" // ✅ 关键点
                      onClick={() => openServiceDetail(service.id)}
                    >
                      <FaCamera />
                      {t("free")}
                    </button>
                  ) : (
                    <Button
                      className="button-white"
                      size="sm"
                      type="button" // ✅ 关键点
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
                        {t("serviceItem")}
                      </span>
                      {service.remark && (
                        <span className="mt-0.5 truncate text-[11px] text-gray-400">
                          {t("remark")}: {service.remark}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500">
                        x{service.quantity}
                      </span>
                      <span className="text-sm font-semibold text-red-500">
                        {currency.symbol}
                        {service.price}
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
          </div>

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
                        {currentService.sample.map(
                          (url: string, index: any) => (
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
                          ),
                        )}
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
                    <span className="text-sm text-gray-700">
                      {t("serviceFee")}
                    </span>
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
        </Form>
      </div>
      <div className="flex flex-col gap-3 border-t bg-white p-4">
        <Button
          className="w-full"
          color="primary"
          form="form"
          isDisabled={!acceptAgreement || loading}
          isLoading={loading}
          type="submit"
        >
          {t("submit")}
        </Button>

        <Checkbox
          className="text-base"
          isSelected={acceptAgreement}
          size="sm"
          onValueChange={setAcceptAgreement}
        >
          {t("acceptAgreement")}
        </Checkbox>
      </div>
    </>
  );
}
