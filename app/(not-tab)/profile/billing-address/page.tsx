"use client";
import React, { useState } from "react";

// import ShopCard from "./shop-card";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import AddressItem from "./address-item";

import ConfirmModal from "@/components/confirm-modal";
import FormModal from "@/components/modal/form-modal";
import { addAddress, deleteAddress, updateAddress } from "@/services/address";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useBillingAddressList } from "@/hook";
type ModalType = "add" | "edit" | "delete" | null;
const initAddress = {
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 0,
};
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

export default function Cart() {
  const { data, isLoading } = useBillingAddressList();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentData, setCurrentData] = useState<any>(initAddress);
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleAdd = () => {
    setCurrentData(initAddress);
    setModalType("add");
  };

  const handleEdit = (row: any) => {
    setCurrentData(row);
    setModalType("edit");
  };

  const handleDelete = (row: any) => {
    setCurrentData(row);
    setModalType("delete");
  };
  // 地址保存时处理
  const handleSave = async () => {
    console.log("当前行数据:", currentData);
    const { createTime, updateTime, customerId, ...filteredData } = currentData;

    try {
      if (modalType === "add") {
        const tip = await addAddress({ ...currentData, addressType: 1 }); // 新增接口

        addToast({
          title: tip,
          timeout: 1000,
          color: "success",
        });
      } else if (modalType === "edit") {
        const tip = await updateAddress(filteredData); // 编辑接口

        addToast({
          title: tip,
          timeout: 1000,
          color: "success",
        });
      } else if (modalType === "delete") {
        const tip = await deleteAddress(currentData.id);

        addToast({
          title: tip,
          timeout: 1000,
          color: "success",
        });
      }
      setModalType(null);
    } catch (e) {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["billingAddressList"] }); // 手动刷新
    }
  };

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="flex h-[calc(var(--vh)_*_100)] flex-col justify-between overflow-hidden">
      <NavBar
        className="bg-white"
        right={
          data.length === 0 ? <button onClick={handleAdd}>添加</button> : null
        }
        onBack={() => router.back()}
      >
        账单地址
      </NavBar>

      <div className="flex-1 overflow-auto px-3">
        {data?.map((addressDetail: any) => (
          <AddressItem
            key={addressDetail.id}
            addressDetail={addressDetail}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
      <FormModal
        fields={fieldsaddress}
        formData={currentData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? "添加地址" : "编辑地址"}
        onChange={setCurrentData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />
      <ConfirmModal
        content={`确定要删除该地址吗？`}
        isOpen={modalType === "delete"}
        onConfirm={(close) => {
          handleSave();
          close();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </div>
  );
}
