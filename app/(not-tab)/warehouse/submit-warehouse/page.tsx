"use client";
import { NavBar } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, Textarea } from "@heroui/react";

import { AddAddressCard } from "./add-address-card";
import AddressCard from "./address-card";
import WarehouseCard from "./warehouse-card";
import ServiceCard from "./service-card";
import RouteCard from "./route-card";

import { useAddressList, useWarehousePreview } from "@/hook";
import {
  addAddress,
  createWaybill,
  gettWarehouseRoutesList,
  gettWarehouseServicesList,
  updateAddress,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
const fieldsaddress: FieldConfig[] = [
  {
    type: "input",
    name: "recipient",
    label: "收件人",
    placeholder: "请输入收件人姓名",
  },
  {
    type: "input",
    name: "phone",
    label: "联系方式",
    placeholder: "请输入联系方式",
  },
  {
    type: "area",
    name: "area",
    label: "area",
    placeholder: "area",
  },

  {
    type: "input",
    name: "address",
    label: "详细地址",
    placeholder: "请输入您详细地址",
  },
  {
    type: "input",
    name: "doorNo",
    label: "门牌号",
    placeholder: "请输入您的门牌号",
  },
  {
    type: "input",
    name: "postcode",
    label: "邮编",
    placeholder: "请输入邮编",
  },

  {
    type: "checkbox",
    name: "defaultAddress",
    label: "设为默认地址",
  },
];
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
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;
  const { data, isLoading, isError } = useWarehousePreview(key);
  const { data: addressData } = useAddressList();

  const [orderData, setOrderData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]);

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const [modalType, setModalType] = useState<ModalType>(null);

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
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };
  const handleCartSubmit = async () => {
    if (!isCheck) {
      return addToast({
        title: "请勾选免责声明",
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedAddressId) {
      return addToast({
        title: "请选择收货地址",
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedRouteId) {
      return addToast({
        title: "请选择运输路线",
        timeout: 1500,
        color: "warning",
      });
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        serviceList: selectedServices.map((sid) => ({
          serviceId: sid,
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

      addToast({ title: "提交成功", timeout: 1500, color: "success" });
      router.push(`/profile/order`);
    } catch (err) {
      console.error("提交失败", err);
      addToast({ title: "提交失败", timeout: 1500, color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    gettWarehouseServicesList().then((res) => setServices(res || []));
    gettWarehouseRoutesList().then((res) => setRoutesData(res || []));
  }, []);
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="flex h-screen flex-col bg-[#f7f8f9]">
      {/* 顶部导航 */}
      <NavBar className="bg-white" onBack={() => router.back()}>
        包裹提交
      </NavBar>

      {/* 内容区滚动 */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {/* 地址 */}
        <div>
          <div className="mb-2 text-base font-semibold">Shipping Address</div>
          <div className="flex gap-3 overflow-x-auto">
            {addressData?.length === 0 ? (
              <AddAddressCard onAdd={handleAdd} />
            ) : (
              addressData?.map((addr: any) => (
                <AddressCard
                  key={addr.id}
                  data={addr}
                  isSelected={selectedAddressId === String(addr.id)}
                  onEdit={() => handleEdit(addr)}
                  onSelect={(id) => setSelectedAddressId(String(id))}
                />
              ))
            )}
          </div>
        </div>

        {/* 商品列表 */}
        <div>
          <div className="mb-2 text-base font-semibold">Commodity List</div>
          <div className="flex flex-col gap-4">
            {data?.packageItemList?.map((warehouse: any) => (
              <WarehouseCard key={warehouse?.id} warehouse={warehouse} />
            ))}
          </div>
        </div>

        {/* 服务多选 */}
        <div>
          <div className="mb-2 text-base font-semibold">Packaging Method</div>
          <div className="flex flex-wrap gap-3">
            {services?.map((svc) => (
              <ServiceCard
                key={svc.id}
                {...svc}
                isSelected={selectedServices.includes(String(svc.id))}
                onSelect={() => toggleService(String(svc.id))}
              />
            ))}
          </div>
        </div>

        {/* 路线选择 */}
        <div>
          <div className="mb-2 text-base font-semibold">Delivery Route</div>
          <div className="flex flex-col gap-3">
            {routesData?.map((route) => (
              <RouteCard
                key={route.id}
                data={route}
                isSelected={selectedRouteId === String(route.id)}
                onSelect={(id) => setSelectedRouteId(String(id))}
              />
            ))}
          </div>
        </div>

        <Textarea
          fullWidth
          classNames={{
            inputWrapper: "bg-white  ",
          }}
          placeholder="If you have any special requirements, please note here"
          size="lg"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
          I have read and agreed bbdbuy Package Shipping Agreement
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
          Submit Package
        </Button>
      </div>
      <FormModal
        fields={fieldsaddress}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? "添加地址" : "编辑地址"}
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
