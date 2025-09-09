"use client";
import { Card } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";

import { addAddress } from "@/services";
import { queryClient } from "@/lib/react-query";
import { FieldConfig } from "@/components/form/formItem-renderer";

interface AddAddressCardProps {
  onAdd?: () => void;
}
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

export function AddAddressCard({ onAdd }: AddAddressCardProps) {
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      await addAddress({
        ...currentRowData,
        addressType: 1,
        defaultAddress: filteredData.defaultAddress ? 1 : 0,
      }); // 新增接口

      setIsOpen(false);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] }); // 手动刷新
    }
  };

  return (
    <Card
      isPressable
      className="flex-1 p-4 rounded-2xl border  border-gray-300 hover:border-primary hover:shadow-md cursor-pointer flex items-center justify-center min-h-[120px]"
      shadow="none"
      onClick={onAdd}
    >
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <FiPlus className="w-6 h-6" />
        <span className="text-sm">Add Address</span>
      </div>
    </Card>
  );
}
