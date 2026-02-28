"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Form,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { FieldConfig } from "../form/formItem-renderer";
import FormItemRenderer from "../form/formItem-renderer";
import { useVisualViewport } from "@/hook/common";
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
  const t2 = useTranslations("components.modal");

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
  const [isLoading, setIsLoading] = useState(false);
  useVisualViewport();

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
    <Drawer
      classNames={{
        base: "rounded-t-xl",
      }}
      isDismissable={!isLoading}
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
    >
      <DrawerContent style={{ maxHeight: "var(--visual-viewport-height, 100dvh)", transition: "max-height 0.1s ease-out" }}>
        <div className="min-h-[300px]">
          <DrawerHeader className="flex flex-col gap-1 border-b border-gray-100 py-3 text-center">
            {type === "add" ? t("addTitle") : t("editTitle")}
          </DrawerHeader>
          <DrawerBody className="overflow-y-auto p-4 scrollbar-hide w-full">
            <Form className="w-full min-h-[300px]" onSubmit={handleSave}>
              <FormItemRenderer
                fields={billingAddress}
                formData={formData}
                onChange={setFormData}
              />
            </Form>
          </DrawerBody>
          <DrawerFooter className="border-t border-gray-100 p-4">
            <Button
              className="w-full font-medium"
              color="primary"
              isLoading={isLoading}
              onPress={async () => {
                try {
                  setIsLoading(true);
                  await handleSave();
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {t2("confirm")}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
