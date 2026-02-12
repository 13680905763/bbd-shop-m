"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Form } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { FieldConfig } from "../form/formItem-renderer";
import FormItemRenderer from "../form/formItem-renderer";
import CommonDrawer from "./common-drawer";
import { validateField } from "../form/utils";

import { useAddBillingAddress, useUpdateAddress } from "@/hook/api";

export interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "add" | "edit";
  defaultData?: any;
}

const initAddress = {
  familyName: "",
  givenName: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  doorNo: "",
  address: "",
};

export default function EditBillingAddressDrawer({
  isOpen,
  onOpenChange,
  type,
  defaultData,
}: AddressModalProps) {
  const t = useTranslations("components.modal.billingAddress");
  const { mutateAsync: addBillingAddressMutate } = useAddBillingAddress();
  const { mutateAsync: updateBillingAddressMutate } = useUpdateAddress();

  const billingAddress: FieldConfig[] = [
    {
      type: "input",
      name: "familyName",
      label: t("fields.familyName.label"),
      placeholder: t("fields.familyName.placeholder"),
      required: true,
      errorMessage: t("fields.familyName.errorMessage"),
    },
    {
      type: "input",
      name: "givenName",
      label: t("fields.givenName.label"),
      placeholder: t("fields.givenName.placeholder"),
      required: true,
      errorMessage: t("fields.givenName.errorMessage"),
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
  ];
  const [formData, setFormData] = useState<any>(initAddress);

  useEffect(() => {
    if (type === "edit" && defaultData) {
      setFormData({ ...initAddress, ...defaultData });
    } else if (type === "add") {
      setFormData(initAddress);
    }
  }, [type, defaultData, isOpen]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault(); // 阻止表单默认提交
    const isValid = billingAddress.every((field) => validateField(field, formData));
    if (!isValid) return;

    const { createTime, updateTime, customerId, ...filteredData } = formData;

    try {
      if (type === "add") {
        await addBillingAddressMutate({
          ...formData,
        });
      } else if (type === "edit") {
        await updateBillingAddressMutate({
          ...filteredData,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CommonDrawer
      isOpen={isOpen}
      title={type === "add" ? t("addTitle") : t("editTitle")}
      onConfirm={handleSave}
      onOpenChange={onOpenChange}
    >
      <Form className="w-full" onSubmit={handleSave}>
        <FormItemRenderer
          fields={billingAddress}
          formData={formData}
          onChange={setFormData}
        />
      </Form>
    </CommonDrawer>
  );
}
