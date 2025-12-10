"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, Spinner, Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import AddressCard from "./address-card";
import { AddAddressCard } from "./add-address-card";
import WarehouseCard from "./warehouse-card";
import ServiceCard from "./service-card";
import ShippingRouteCard from "./shipping-route-card";

import { useAddressList, useWarehousePreview } from "@/hook";
import {
  addAddress,
  createWaybill,
  getWarehouseRoutesList,
  getWarehouseRoutesListByCC,
  getWarehouseServicesList,
  updateAddress,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import FormModal from "@/components/modal/form-modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { FieldConfig } from "@/components/form/formItem-renderer";

type ModalType = "add" | "edit" | null;
export default function SubmitOrder() {
  const t = useTranslations("submit.warehouse");
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;

  // 地址相关
  const initAddress = {
    recipient: "",
    phone: "",
    countryId: "",
    stateId: "",
    city: "",
    addressType: "",
    postcode: "",
    defaultAddress: 0,
    doorNo: "",
  };
  const addressFormFields: FieldConfig[] = [
    {
      key: "recipient",
      type: "input",
      name: "recipient",
      label: t("addressModal.fields.recipient.label"),
      placeholder: t("addressModal.fields.recipient.placeholder"),
      required: true,
    },
    {
      key: "phone",
      type: "input",
      name: "phone",
      label: t("addressModal.fields.phone.label"),
      placeholder: t("addressModal.fields.phone.placeholder"),
      required: true,
    },
    {
      key: "area",
      type: "area",
      name: "area",
      label: t("addressModal.fields.area.label"),
      placeholder: t("addressModal.fields.area.placeholder"),
    },
    {
      key: "address",
      type: "input",
      name: "address",
      label: t("addressModal.fields.address.label"),
      placeholder: t("addressModal.fields.address.placeholder"),
      required: true,
    },
    {
      key: "doorNo",
      type: "input",
      name: "doorNo",
      label: t("addressModal.fields.doorNo.label"),
      placeholder: t("addressModal.fields.doorNo.placeholder"),
      required: true,
    },
    {
      key: "postcode",
      type: "input",
      name: "postcode",
      label: t("addressModal.fields.postcode.label"),
      placeholder: t("addressModal.fields.postcode.placeholder"),
      required: true,
    },
    {
      key: "defaultAddress",
      type: "checkbox",
      name: "defaultAddress",
      label: t("addressModal.fields.defaultAddress.label"),
    },
  ];
  const [currentAddress, setCurrentAddress] = useState<any>(initAddress);
  const [addressModalType, setAddressModalType] = useState<ModalType>(null);

  const handleAdd = () => {
    setCurrentAddress(initAddress);
    setAddressModalType("add");
  };
  const handleEdit = (row: any) => {
    setCurrentAddress(row);
    setAddressModalType("edit");
  };
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentAddress;

    try {
      if (addressModalType === "add") {
        await addAddress({
          ...currentAddress,
          addressType: 1,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        }); // 新增接口
      } else if (addressModalType === "edit") {
        await updateAddress({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      }
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] }); // 手动刷新
    }
  };

  // 附加服务相关
  const [loadingService, setLoadingService] = useState(true);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // 路由路线相关
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const { data, isLoading, isError } = useWarehousePreview(key);
  const { data: addressData } = useAddressList();

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<
    { id: string; quantity: number }[]
  >([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  // 初始化加载 附加服务 所有路由路线
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 两个请求并行
        const [serviceRes, routeRes] = await Promise.all([
          getWarehouseServicesList(),
          getWarehouseRoutesList(),
        ]);

        setServicesList(serviceRes || []);
        setRoutesList(routeRes || []);
      } catch {
        // 遇到异常时至少保证不挂
        setServicesList([]);
        setRoutesList([]);
      } finally {
        setLoadingService(false);
        setLoadingRoute(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const countryId = addressData?.find(
      (item: any) => item.id == selectedAddressId,
    )?.countryId;

    if (!countryId) return;
    setLoadingRoute(true);
    getWarehouseRoutesListByCC({
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
  }, [selectedAddressId]);

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
  const handleCartSubmit = async () => {
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
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
      {(isLoading || loadingService) && <FullscreenLoader />}
      {/* 顶部导航 */}
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>

      {/* 内容区滚动 */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {/* 地址 */}
        <div>
          <div className="mb-2 text-base font-semibold">
            {t("shippingAddress")}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {addressData?.length === 0
              ? null
              : addressData?.map((addr: any) => (
                  <AddressCard
                    key={addr.id}
                    data={addr}
                    isDisabled={loadingRoute}
                    isSelected={selectedAddressId === String(addr.id)}
                    onEdit={() => handleEdit(addr)}
                    onSelect={(id: string | null) => setSelectedAddressId(id)}
                  />
                ))}
            <AddAddressCard onAdd={handleAdd} />
          </div>
        </div>

        {/* 商品列表 */}
        <div>
          <div className="mb-2 text-base font-semibold">
            {t("commodityList")}
          </div>
          <div className="flex flex-col gap-4">
            {data?.packageItemList?.map((warehouse: any) => (
              <WarehouseCard key={warehouse?.id} warehouse={warehouse} />
            ))}
          </div>
        </div>

        {/* 服务多选 */}
        <div>
          <div className="mb-2 text-base font-semibold">
            {t("packagingMethod")}
          </div>
          <div className="flex flex-col flex-wrap gap-2">
            {servicesList?.map((service) => {
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
            })}
          </div>
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
      <div className="sticky bottom-0 z-10 w-full border-t bg-white px-4 py-3">
        <Button
          className="w-full rounded-lg text-lg"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={handleCartSubmit}
        >
          {t("submitPackage")}
        </Button>
      </div>

      {/* 地址modal */}
      <FormModal
        fields={addressFormFields}
        formData={currentAddress}
        isOpen={!!addressModalType}
        title={
          addressModalType === "add"
            ? t("addressModal.addAddress")
            : t("addressModal.editAddress")
        }
        onChange={setCurrentAddress}
        onOpenChange={(open) => {
          if (!open) setAddressModalType(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
