"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { FieldConfig } from "../form/formItem-renderer";

import FormModal from "./form-modal";

import { useAddAddress, useUpdateAddress } from "@/hook/api";

export interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "add" | "edit";
  defaultData?: any;
}

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
  address: "",
};

export default function AddressModal({
  isOpen,
  onOpenChange,
  type,
  defaultData,
}: AddressModalProps) {
  const t = useTranslations("components.modal.address");
  const { mutateAsync: addAddressMutate } = useAddAddress();
  const { mutateAsync: updateAddressMutate } = useUpdateAddress();

  const queryClient = useQueryClient();

  const addressFields: FieldConfig[] = [
    {
      type: "input",
      name: "recipient",
      label: t("fields.recipient.label"),
      placeholder: t("fields.recipient.placeholder"),
      required: true,
      errorMessage: t("fields.recipient.errorMessage"),
    },
    {
      type: "input",
      name: "phone",
      label: t("fields.phone.label"),
      placeholder: t("fields.phone.placeholder"),
      required: true,
      errorMessage: t("fields.phone.errorMessage"),
    },
    {
      type: "area",
      name: "area",
      label: t("fields.area.label"),
      placeholder: t("fields.area.placeholder"),
    },
    {
      type: "input",
      name: "address",
      label: t("fields.address.label"),
      placeholder: t("fields.address.placeholder"),
      required: true,
      errorMessage: t("fields.address.errorMessage"),
    },
    {
      type: "input",
      name: "doorNo",
      label: t("fields.doorNo.label"),
      placeholder: t("fields.doorNo.placeholder"),
      required: true,
      errorMessage: t("fields.doorNo.errorMessage"),
    },
    {
      type: "input",
      name: "postcode",
      label: t("fields.postcode.label"),
      placeholder: t("fields.postcode.placeholder"),
      required: true,
      errorMessage: t("fields.postcode.errorMessage"),
    },
    {
      type: "checkbox",
      name: "defaultAddress",
      label: t("fields.defaultAddress.label"),
    },
  ];
  const [formData, setFormData] = useState<any>(initAddress);

  useEffect(() => {
    if (type === "edit" && defaultData) {
      setFormData({ ...initAddress, ...defaultData });
    } else if (type === "add") {
      setFormData(initAddress);
    }
  }, [type, defaultData, isOpen]);

  const handleSave = async (data: any) => {
    const { createTime, updateTime, customerId, ...filteredData } = data;
    try {
      if (type === "add") {
        await addAddressMutate({
          ...data,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        });
      } else if (type === "edit") {
        await updateAddressMutate({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        });
      }
      onOpenChange(false);
      return true;
    } finally {
    }
  };

  return (
    <FormModal
      fields={addressFields}
      formData={formData}
      isOpen={isOpen}
      title={type === "add" ? t("addTitle") : t("editTitle")}
      onChange={setFormData}
      onOpenChange={onOpenChange}
      onSubmit={handleSave}
    />
  );
}
