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

import ServiceCard from "./service-card";
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

export default function SubmitWarehouse() {
  const t = useTranslations("submit.warehouse");
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
    t("routesMessage"),
  );

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const { data, isLoading: productLoading, isError } = useWarehousePreview(key);
  const { data: addressData, isLoading: addressLoading } = useAddressList();
  const { data: services, isLoading: servicesLoading } = useWarehouseServices();

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<
    { id: string; quantity: number }[]
  >([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  // 默认选中默认地址
  useEffect(() => {
    if (addressData?.length && !selectedAddressId) {
      const defaultAddr = addressData.find(
        (addr: any) => addr.defaultAddress === 1,
      );

      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addressData, selectedAddressId]);

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

  // 切换服务选择
  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.id === id);

      if (exists) {
        // 取消选择
        return prev.filter((item) => item.id !== id);
      }

      // 新增：默认数量 1
      return [...prev, { id, quantity: 1 }];
    });
  };
  const handleCountChange = (id: string, nextCount: number) => {
    setSelectedServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: nextCount } : item,
      ),
    );
  };
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
        serviceList: selectedServices.map((sid) => ({
          serviceId: sid?.id,
          quantity: sid?.quantity,
          remark: "",
        })),
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
      <div className="flex-1 space-y-2 overflow-y-auto px-2 py-3">
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

        {/* 服务多选 */}
        <div>
          <div className="text-base font-semibold">{t("packagingMethod")}</div>
          <div className="space-y-1">
            {servicesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 rounded-lg" />
              </div>
            ) : (
              services?.map((service: any) => {
                const selectedItem = selectedServices.find(
                  (item) => item.id === String(service.id),
                );

                return (
                  <ServiceCard
                    key={service.id}
                    {...service}
                    isSelected={!!selectedItem}
                    quantity={
                      selectedServices.find((s) => s.id === service.id)
                        ?.quantity || 1
                    }
                    onCountChange={handleCountChange}
                    onSelect={() => toggleService(String(service.id))}
                  />
                );
              })
            )}
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
          {loadingRoute ? (
            <div className="flex h-[20vh] items-center justify-center">
              <Spinner />
            </div>
          ) : (
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
        <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
          {t("agreement")}
        </Checkbox>
      </div>

      {/* 底部提交 */}
      <div className="border-t bg-white px-4 py-3">
        {/* <p>
          总重量： {data?.outbound?.estimateTotalWeight || 0} g
        </p>
        <p>
          总体积： {data?.outbound?.estimateTotalVolume || 0}  cm³
        </p> */}
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
