"use client";
import { useEffect, useState } from "react";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";

import { FieldConfig } from "@/components/form/formItem-renderer";
import FormModal from "@/components/modal/form-modal";
import { addAddress, updateAddress } from "@/services";
import { AddressItem } from "@/types";
import { queryClient } from "@/lib/react-query";

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
];

type ModalType = "add" | "edit" | null;
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

export default function BillingAddress({ billingAddress }: any) {
  //   const billingAddress = useBillingAddressStore(
  //     (state) => state.billingAddress,
  //   );
  console.log("billingAddress", billingAddress);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentData, setCurrentData] = useState<any>(initAddress);

  const handleAdd = () => {
    setCurrentRowData(initAddress);
    setModalType("add");
  };

  const handleEdit = () => {
    setModalType("edit");
  };

  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } = currentData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentData,
          addressType: 2,
          defaultAddress: 1,
        }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      }
      setModalType(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log(123);

      queryClient.invalidateQueries({ queryKey: ["billingAddress"] }); // 手动刷新
    }
  };

  useEffect(() => {
    setCurrentData(billingAddress);
    console.log("currentRowData", currentData);
  }, [billingAddress]);

  return (
    <>
      {Object.keys(billingAddress as AddressItem).length ? (
        <div className="relative rounded-xl border-2 border-dashed border-[#5e5e5e] p-4">
          <div className="flex justify-between">
            <div className="flex gap-8">
              <div className="text-title">{billingAddress?.recipient}</div>
              <div>{billingAddress?.phone}</div>
            </div>
            <div>{billingAddress?.postcode}</div>
          </div>
          <div className="text-gray-base mt-2">
            {billingAddress?.address},{billingAddress?.city},
            {billingAddress?.state},{billingAddress?.country}
          </div>

          {/* 编辑按钮放在右下角 */}
          <button
            className="absolute bottom-2 right-4 flex items-center gap-1 text-sm text-[#f0700c] transition"
            onClick={handleEdit}
          >
            <AiOutlineEdit className="h-4 w-4" />
            <span>编辑</span>
          </button>
        </div>
      ) : (
        <button
          className="w-full border-2 border-dashed border-[#5e5e5e] p-6"
          onClick={handleAdd}
        >
          <p className="flex items-center justify-center gap-2">
            <span>+</span>
            <span>添加账单地址</span>
          </p>
        </button>
      )}

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
    </>
  );
}
