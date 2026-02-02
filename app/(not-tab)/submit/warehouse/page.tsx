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
import { IoChevronForward } from "react-icons/io5";

import ShippingRouteCard from "./shipping-route-card";
import WarehouseServiceCard from "./werahouse-service-card";
import TotalStatsCard from "./total-stats-card";

import WarehouseProductItem from "@/components/block/warehouse-product-item";
import AddressItem from "@/components/block/address-item";
import {
  useWarehouseServicesList,
  useWaybillFeeEstimate,
  useWaybillPreview,
  useAddressList,
  useLineByWaybill,
  useCreateWaybill,
} from "@/hook/api";
import { useEnhancedSelection } from "@/hook/common";
import { useGlobalStore } from "@/store";
import ServiceSelectionModal from "@/components/modal/service-selection-modal";
import AddressSelectionModal from "@/components/modal/address-selection-modal";
import RouteSelectionModal from "@/components/modal/route-selection-modal";
import ExpandableList from "@/components/common/expandable-list";

export default function SubmitWarehouse() {
  const t = useTranslations("submit.warehouse");
  const { currency } = useGlobalStore();
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;
  const { data, isLoading: productLoading, isError } = useWaybillPreview(key);
  const { packageItemList = [], param = {}, outbound = {} } = data || {};
  const { estimateTotalWeight = 0, estimateTotalVolume = 0 } = outbound || {};

  // 附加服务相关
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
  const [showServiceModal, setShowServiceModal] = useState(false);

  // 地址相关
  const { data: addressData, isLoading: addressLoading } = useAddressList();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressModal, setShowAddressModal] = useState(false);

  // 默认选中默认地址
  useEffect(() => {
    if (addressData?.length && !selectedAddressId) {
      const defaultAddr = addressData.find(
        (addr: any) => addr.defaultAddress === 1,
      );

      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [addressData, selectedAddressId]);
  // 选中地址国家id
  const countryId = useMemo(() => {
    return addressData?.find((item: any) => item.id == selectedAddressId)
      ?.countryId;
  }, [selectedAddressId, addressData]);

  const {
    data: lineData,
    isLoading: lineLoading,
    isError: lineError,
  } = useLineByWaybill(
    countryId
      ? {
          categoryIds: packageItemList.map((item: any) => item?.categoryId),
          countryId,
          weight: estimateTotalWeight,
          volume: estimateTotalVolume,
        }
      : null,
  );

  console.log("lineData:", lineData);
  console.log("lineError:", lineError);

  const [showRouteModal, setShowRouteModal] = useState(false);

  useEffect(() => {
    if (!Array.isArray(lineData)) {
      setSelectedRouteId(null);
    }
  }, [lineData]);

  const [isCheck, setIsCheck] = useState(false);

  const { mutateAsync: createWaybill, isPending: isSubmitting } =
    useCreateWaybill();

  // 都用 string 类型 id 进行比较

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  const estimatePayload = useMemo(() => {
    if (!selectedRouteId || !selectedAddressId || !param) return null;

    return {
      serviceList: getSelectedServices(),
      templateId: selectedRouteId,
      addressId: selectedAddressId,
      ...param,
    };
  }, [
    selectedRouteId,
    selectedAddressId,
    getSelectedServices,
    services,
    param,
  ]);

  const { data: feeEstimate, isFetching: isEstimating } =
    useWaybillFeeEstimate(estimatePayload);

  useEffect(() => {
    if (estimatePayload && feeEstimate) {
      console.log("Fee Estimating:", feeEstimate);
    }
  }, [estimatePayload]);

  // 地址相关

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

    if (isSubmitting) return;

    try {
      const payload = {
        serviceList: getSelectedServices(),
        templateId: selectedRouteId,
        addressId: selectedAddressId,
        remark,
        ...param,
      };

      console.log("提交数据", payload);

      // 调接口
      await createWaybill(payload);

      router.push(`/profile/package`);
    } catch {}
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-2 py-3 scrollbar-hide">
        <div className="rounded-lg bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-base font-semibold">
              {t("commodityList")}
              {productLoading ? "" : `(${packageItemList.length})`}
            </div>
          </div>
          <div className="space-y-1">
            {productLoading ? (
              <Skeleton className="h-20 rounded-lg" />
            ) : (
              <ExpandableList
                items={packageItemList}
                renderItem={(warehouse: any) => (
                  <WarehouseProductItem
                    product={warehouse?.orderProduct}
                    warehouse={warehouse}
                  />
                )}
              />
            )}
          </div>
        </div>
        <div className="rounded-lg bg-white p-3">
          <div
            className="mb-2 flex cursor-pointer items-center justify-between"
            role="button"
            onClick={() => setShowServiceModal(true)}
          >
            <div className="text-base font-semibold">
              {t("packagingMethod")}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{t("select")}</span>
              <IoChevronForward size={16} />
            </div>
          </div>
          <div className="space-y-1">
            {getSelectedServices().length === 0 ? (
              <div
                className="cursor-pointer rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-400"
                role="button"
                onClick={() => setShowServiceModal(true)}
              >
                {t("noServiceSelected")}
              </div>
            ) : (
              <ExpandableList
                items={services.filter((s) => s.isSelected)}
                renderItem={(service: any) => (
                  <WarehouseServiceCard
                    key={service.id}
                    service={service}
                    size="sm"
                    onSelect={toggleSelection}
                    onUpdateQuantity={updateQuantity}
                  />
                )}
              />
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-3">
          <div
            className="mb-2 flex cursor-pointer items-center justify-between"
            role="button"
            onClick={() => setShowAddressModal(true)}
          >
            <div className="text-base font-semibold">
              {t("shippingAddress")}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{t("select")}</span>
              <IoChevronForward size={16} />
            </div>
          </div>
          {addressLoading ? (
            <Skeleton className="h-12 rounded-lg" />
          ) : (
            <>
              {selectedAddressId ? (
                addressData
                  ?.filter((a: any) => a.id === selectedAddressId)
                  .map((address: any) => (
                    <AddressItem
                      key={address.id}
                      addressDetail={address}
                      selectable={true}
                      selected={false}
                      showDeleteButton={false}
                      size="sm"
                      onEdit={() => setShowAddressModal(true)}
                      onSelect={() => setShowAddressModal(true)} // 点击已选地址也重新打开选择弹窗
                    />
                  ))
              ) : (
                <div
                  className="cursor-pointer rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-400"
                  role="button"
                  onClick={() => setShowAddressModal(true)}
                >
                  {t("noAddressSelected")}
                </div>
              )}
            </>
          )}
        </div>

        <div className="rounded-lg bg-white p-3">
          <div
            className="mb-2 flex cursor-pointer items-center justify-between"
            role="button"
            onClick={() => {
              if (!selectedAddressId) {
                return addToast({
                  title: t("toast.selectAddress"),
                  timeout: 1500,
                  color: "warning",
                });
              }
              setShowRouteModal(true);
            }}
          >
            <div className="text-base font-semibold">{t("deliveryRoute")}</div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{t("select")}</span>
              <IoChevronForward size={16} />
            </div>
          </div>

          {/* 如果在加载，优先显示 loading */}
          {lineLoading ? (
            <Spinner className="flex justify-center" />
          ) : (
            <>
              {Array.isArray(lineData) &&
              lineData.length > 0 &&
              selectedRouteId ? (
                lineData
                  .filter((r: any) => String(r.id) === selectedRouteId)
                  .map((route: any) => (
                    <ShippingRouteCard
                      key={route.id}
                      isSelected={false}
                      route={route}
                      size="sm"
                      onSelect={() => setShowRouteModal(true)}
                    />
                  ))
              ) : (
                <div
                  className="cursor-pointer rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-center text-sm text-gray-400"
                  role="button"
                  onClick={() => {
                    if (!selectedAddressId) {
                      return addToast({
                        title: t("toast.selectAddress"),
                        timeout: 1500,
                        color: "warning",
                      });
                    }
                    setShowRouteModal(true);
                  }}
                >
                  {typeof lineData === "string"
                    ? lineData
                    : t("noRouteSelected")}
                </div>
              )}
            </>
          )}
        </div>

        {/* 费用估算区域 */}
        <div>
          <TotalStatsCard
            volume={estimateTotalVolume}
            weight={estimateTotalWeight}
          />

          {isEstimating ? (
            <div className="mt-2 flex items-center justify-center rounded-lg bg-white p-4 text-center text-sm">
              <div>{t("estimating")}</div>
              <Spinner className="ml-2" size="sm" />
            </div>
          ) : (
            feeEstimate?.outbound && (
              <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {t("estimatedShipping")}
                  </span>
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
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="font-semibold text-gray-900">
                    {t("estimatedTotal")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {currency.symbol}
                    {feeEstimate.outbound.totalFee}
                  </span>
                </div>
                <div className="rounded bg-gray-50 p-2 text-left text-xs text-gray-400">
                  {t("estimatedTip")}
                </div>
              </div>
            )
          )}
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
      </div>

      {/* 底部提交 */}
      <div className="border-t bg-white px-4 py-3">
        <Button
          className="w-full"
          color="primary"
          isLoading={isSubmitting}
          size="md"
          onPress={handleSubmit}
        >
          {t("submitPackage")}
        </Button>
        <div className="mt-3 flex justify-center">
          <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
            <span className="text-xs text-gray-500">{t("agreement")}</span>
          </Checkbox>
        </div>
      </div>

      {/* 服务选择弹窗 */}
      <ServiceSelectionModal
        isOpen={showServiceModal}
        services={services}
        onOpenChange={setShowServiceModal}
        onSelect={toggleSelection}
        onUpdateQuantity={updateQuantity}
      />

      {/* 地址选择弹窗 */}
      <AddressSelectionModal
        addressList={addressData || []}
        isOpen={showAddressModal}
        selectedAddressId={selectedAddressId}
        onOpenChange={setShowAddressModal}
        onSelect={(addr) => setSelectedAddressId(addr.id)}
      />

      {/* 路线选择弹窗 */}
      <RouteSelectionModal
        isOpen={showRouteModal}
        routes={Array.isArray(lineData) ? lineData : []}
        routesMessage={typeof lineData === "string" ? lineData : ""}
        selectedRouteId={selectedRouteId}
        onOpenChange={setShowRouteModal}
        onSelect={(id) => setSelectedRouteId(id)}
      />
    </>
  );
}
