"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import { AddAddressCard } from "./add-address-card";
import AddressCard from "./address-card";
import WarehouseCard from "./warehouse-card";
import ServiceCard from "./service-card";
import RouteCard from "./route-card";

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

type ModalType = "add" | "edit" | "delete" | null;
export default function SubmitOrder() {
  const t = useTranslations("submitWarehouse");
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;
  // const t = useTranslations("AddressTab");

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>("");

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
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const [modalType, setModalType] = useState<ModalType>(null);

  useEffect(() => {
    getWarehouseServicesList().then((res) => setServices(res || []));
  }, []);
  useEffect(() => {
    if (!selectedAddressId) {
      getWarehouseRoutesList().then((res) => setRoutesData(res || []));
    }
  }, [selectedAddressId]);
  useEffect(() => {
    const countryId = addressData?.find(
      (item: any) => item.id == selectedAddressId,
    )?.countryId;

    if (!countryId) return;
    getWarehouseRoutesListByCC({
      categoryIds: data?.packageItemList.map((item: any) => item?.categoryId),
      countryId,
    }).then((res) => {
      if (typeof res != "string" && res?.length) {
        setRoutesData(res || []);
      } else {
        setSelectedRouteId("");
        setRoutesData([]);
        setRoutesMessage(res);
      }
    });
  }, [selectedAddressId]);
  const handleAdd = () => {
    setCurrentRowData(initAddress);
    setModalType("add");
  };
  const handleEdit = (row: any) => {
    setCurrentRowData(row);
    setModalType("edit");
  };
  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentRowData,
          addressType: 1,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      }
      setModalType(null);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] }); // 手动刷新
    }
  };
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

      // // 调接口
      await createWaybill(payload);

      // addToast({ title: "提交成功", timeout: 1500, color: "success" });
      router.push(`/profile/package`);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  {
    isLoading && <FullscreenLoader />;
  }

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
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
            {services?.map((svc) => {
              const selectedItem = selectedServices.find(
                (item) => item.id === String(svc.id),
              );

              return (
                <ServiceCard
                  key={svc.id}
                  {...svc}
                  initialCount={selectedItem?.quantity ?? 1}
                  isSelected={!!selectedItem}
                  onCountChange={handleCountChange}
                  onSelect={() => toggleService(String(svc.id))}
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
          <div className="flex flex-col gap-3">
            {routesData?.map((route) => (
              <RouteCard
                key={route.id}
                data={route}
                isSelected={selectedRouteId === String(route.id)}
                onSelect={(id) => setSelectedRouteId(String(id))}
              />
            ))}
            {routesData?.length < 1 && (
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
      <FormModal
        fields={t.raw("fields")}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={
          modalType === "add"
            ? t.raw("texts.title.add")
            : t.raw("texts.title.edit")
        }
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
