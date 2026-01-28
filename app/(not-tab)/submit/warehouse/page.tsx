"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Skeleton,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import ShippingRouteCard from "./shipping-route-card";

import {
  useAddressList,
  useWarehousePreview,
  useWarehouseServices,
} from "@/hook";
import { createWaybill, getRoutesByQuery } from "@/services";
import AddressModal from "@/components/modal/address-modal";
import { Address, AddressModalState } from "@/types";
import WarehouseProductItem from "@/components/block/warehouse-product-item";
import AddressItem from "@/components/block/address-item";
import { useWarehouseServicesList, useWaybillFeeEstimate } from "@/hook/api";
import { useEnhancedSelection } from "@/hook/common";
import WarehouseServiceCard from "./werahouse-service-card";
import { useGlobalStore } from "@/store";

export default function SubmitWarehouse() {
  const t = useTranslations("submit.warehouse");
  const { currency } = useGlobalStore();

  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;
  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });

  // 路由路线相关
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>(
    t("defaultMessage"),
  );

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const { data, isLoading: productLoading, isError } = useWarehousePreview(key);
  const { data: addressData, isLoading: addressLoading } = useAddressList();
  const { data: serviceList } = useWarehouseServicesList();
  const {
    items: services, // 渲染数据（包含 isSelected 和 quantity）
    toggleSelection, // 切换选中状态
    updateQuantity, // 更新数量
    getSelectedItems, // 获取选中结果
  } = useEnhancedSelection(serviceList);
  const getSelectedServices = useCallback(() => {
    return getSelectedItems().map((item) => ({
      serviceId: item.id,
      quantity: item.quantity,
      remark: item.remark,
    }));
  }, [getSelectedItems]);



  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");


  const estimatePayload = useMemo(() => {
    if (!selectedRouteId || !selectedAddressId || !data?.param) return null;

    return {
      serviceList: getSelectedServices(),
      templateId: selectedRouteId,
      addressId: selectedAddressId,
      ...data.param,
    };
  }, [selectedRouteId, selectedAddressId, getSelectedServices, services]);

  const { data: feeEstimate, isFetching: isEstimating } =
    useWaybillFeeEstimate(estimatePayload);

  useEffect(() => {
    if (estimatePayload && feeEstimate) {
      console.log("Fee Estimating:", feeEstimate);
    }
  }, [estimatePayload]);
  // 地址相关
  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);
  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  // 选中地址国家id
  const countryId = useMemo(() => {
    return addressData?.find((item: any) => item.id == selectedAddressId)
      ?.countryId;
  }, [selectedAddressId, addressData]);

  useEffect(() => {
    if (!countryId) return;
    setLoadingRoute(true);
    getRoutesByQuery({
      categoryIds: data?.packageItemList.map((item: any) => item?.categoryId),
      countryId,
      weight: data?.outbound?.estimateTotalWeight,
      volume: data?.outbound?.estimateTotalVolume,
    })
      .then((res) => {
        if (typeof res != "string" && res?.length) {
          setRoutesList(res || []);
        } else {
          setSelectedRouteId("");
          setRoutesList([]);
          setRoutesMessage(res);
        }
      })
      .finally(() => {
        setLoadingRoute(false);
      });
  }, [countryId]);


  const handleSubmit = async () => {
    if (!isCheck) {
      return addToast({
        title: t("toast.checkAgreement"),
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedAddressId) {
      return addToast({
        title: t("toast.selectAddress"),
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedRouteId) {
      return addToast({
        title: t("toast.selectRoute"),
        timeout: 1500,
        color: "warning",
      });
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        serviceList: getSelectedServices(),
        templateId: selectedRouteId,
        addressId: selectedAddressId,
        remark,
        ...data.param,
      };

      console.log("提交数据", payload);

      // 调接口
      await createWaybill(payload);

      router.push(`/profile/package`);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 顶部导航 */}
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      {/* 内容区滚动 */}
      <div className="flex-1 space-y-2 overflow-y-auto px-2 py-3 overflow-x-hidden scrollbar-hide">
        {/* 商品列表 */}
        <>
          <div className="text-base font-semibold">{t("commodityList")}</div>
          <div className="space-y-1">
            {productLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 rounded-lg" />
              </div>
            ) : (
              data?.packageItemList?.map((warehouse: any) => (
                <WarehouseProductItem
                  key={warehouse?.id}
                  product={warehouse?.orderProduct}
                  warehouse={warehouse}
                />
              ))
            )}
          </div>
        </>
        <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-xl mt-4 bg-white">
          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {t("totalWeight")}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {data?.outbound?.estimateTotalWeight || 0}
              <span className="text-base font-normal text-gray-500 ml-1">
                g
              </span>
            </p>
          </div>

          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {t("totalVolume")}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {data?.outbound?.estimateTotalVolume || 0}
              <span className="text-base font-normal text-gray-500 ml-1">
                cm³
              </span>
            </p>
          </div>
        </div>
        {/* 服务多选 */}
        <div>
          <div className="text-base font-semibold">{t("packagingMethod")}</div>
          <div className="space-y-1">
            <div className="grid grid-cols-1 gap-2">
              {services?.map((service: any) => {
                return (
                  <WarehouseServiceCard
                    key={service.id}
                    service={service}
                    onSelect={toggleSelection}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* 地址 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-base font-semibold">
              {t("shippingAddress")}
            </span>
            <button onClick={handleAddClick}>{t("addAddress")}</button>
          </div>
          {addressLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 rounded-lg" />
            </div>
          ) : (
            addressData?.length &&
            addressData?.map((address: any) => (
              <AddressItem
                key={address.id}
                selectable
                addressDetail={address}
                selected={address.id === selectedAddressId}
                showDeleteButton={false}
                onEdit={handleEditClick}
                onSelect={(addr) => setSelectedAddressId(addr.id)}
              />
            ))
          )}
        </div>
        {/* 路线选择 */}
        <div>
          <div className="mb-2 text-base font-semibold">
            {t("deliveryRoute")}
          </div>

          {/* 如果在加载，优先显示 loading */}
   
            <div className="flex flex-col gap-3">
              {routesList?.map((route) => (
                <ShippingRouteCard
                  key={route.id}
                  isSelected={selectedRouteId === String(route.id)}
                  route={route}
                  onSelect={(id: any) => setSelectedRouteId(String(id))}
                />
              ))}

              {routesList?.length < 1 && (
                <div className="flex h-[20vh] flex-col items-center justify-center text-gray-500">
                  <p className="mb-2 text-lg">{routesMessage}</p>
                </div>
              )}
            </div>
        </div>

        <Textarea
          fullWidth
          classNames={{
            inputWrapper: "bg-white  ",
            input: "text-base",
          }}
          placeholder={t("textareaPlaceholder")}
          size="lg"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
          {t("agreement")}
        </Checkbox>
      </div>

      {/* 底部提交 */}
      <div className="border-t bg-white px-4 py-3">
        <div>

          {isEstimating ? (
            <div className="mt-2 p-4   text-sm rounded-lg text-center flex items-center justify-center">
              <div>{t("estimating")}</div>
              <Spinner className=" ml-2" />
            </div>
          ) : (
            feeEstimate?.outbound && (
              <div className="mb-2 p-4  bg-gray-100 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("estimatedShipping")}</span>
                  <span className="font-medium">
                    {currency.symbol}
                    {feeEstimate?.outbound.estimateShippingFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("estimatedService")}</span>
                  <span className="font-medium">
                    {currency.symbol}
                    {feeEstimate.outbound.serviceFee}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    {t("estimatedTotal")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {currency.symbol}
                    {feeEstimate.outbound.totalFee}
                  </span>
                </div>
                <div className="text-sm text-gray-500 text-left">
                  {t("estimatedTip")}
                </div>
              </div>
            )
          )}
        </div>
        <Button
          className="w-full"
          color="primary"
          isLoading={submitting}
          size="md"
          onPress={handleSubmit}
        >
          {t("submitPackage")}
        </Button>
      </div>

      {/* 地址modal */}
      <AddressModal
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
