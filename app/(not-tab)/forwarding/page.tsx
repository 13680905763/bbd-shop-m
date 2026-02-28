"use client";
import { Button, Checkbox, Form, } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { NavBar } from "antd-mobile";

import ForwardAddress from "./forward-address";

import { SelectionServiceDrawer } from "@/components/drawer";
import {
  useForwardingOrder,
  useOrderServicesList,
  useUserInfo,
} from "@/hook/api";
import useEnhancedSelection from "@/hook/common/useEnhancedSelection";

import FormItemRenderer, {
  FieldConfig,
} from "@/components/form/formItem-renderer";
import SelectionBlock from "@/components/common/selection-block";
import { SelectedServiceItem } from "@/components/list-item";


export default function ForwardingPage() {
  const t = useTranslations("forwarding");
  const router = useRouter();
  const { data: user, error } = useUserInfo();
  const { mutate: forwardingOrder, isPending } = useForwardingOrder();
  const { data: rawServicesList, isLoading } = useOrderServicesList();
  const {
    items: servicesList,
    toggleSelection,
    updateQuantity,
    updateRemark,
    getSelectedItems,
  } = useEnhancedSelection(rawServicesList || []);

  const [isChecked, setIsChecked] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [formData, setFormData] = useState({
    logisticsCode: "",
    packageItemName: "",
  });

  const fields: FieldConfig[] = [
    {
      name: "logisticsCode",
      label: t("fields.trackingNo.label"),
      type: "input",
      placeholder: t("fields.trackingNo.placeholder"),
      errorMessage: t("fields.trackingNo.errorMessage"),
      required: true,
    },
    {
      name: "packageItemName",
      label: t("fields.packageName.label"),
      type: "input",
      placeholder: t("fields.packageName.placeholder"),
      errorMessage: t("fields.packageName.errorMessage"),
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      logisticsCode: formData.logisticsCode,
      packageItemName: formData.packageItemName,
      serviceList: getSelectedItems().map((item: any) => {
        return {
          serviceId: item.id,
          quantity: item.quantity,
          remark: item.remark,
        };
      }),
      receiver: `代发-${user?.nickName || ""}`,
      receivePhone: "13602579223",
      receiveAddress: "中国广东省惠州市水口街道荔城工业园胜豪科技大厦8A-801",
    };
    const bizCode: any = await forwardingOrder(payload);
    console.log('bizCode');

    if (bizCode) {
      router.push("/payment/" + bizCode);
    } else {
      router.push("/profile/order");
    }
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="h-[120px] bg-[url('/m/images/estimation/bg.webp')] bg-cover bg-no-repeat" />
        <div className="p-2 space-y-2">
          <ForwardAddress />
          {/* 包裹信息 */}
          <div className="w-full rounded-lg bg-white p-4">
            <p className="mb-3 text-lg font-semibold">
              {t("forwardingPackage")}
            </p>
            <Form
              className="w-full "
              id="form"
              onSubmit={handleSubmit}
            >
              <FormItemRenderer
                fields={fields}
                formData={formData}
                onChange={setFormData}
              />
            </Form>
          </div>
          <SelectionBlock
            data={servicesList.filter((s) => s.isSelected)}
            renderItem={(service: any) => (
              <SelectedServiceItem
                key={service.id}
                service={service}
              />
            )}
            isLoading={isLoading}
            title={t("extraServices")}
            onClick={() => setIsServiceSelectionOpen(true)}
          />
          <SelectionServiceDrawer
            isOpen={isServiceSelectionOpen}
            items={servicesList}
            onOpenChange={setIsServiceSelectionOpen}
            onToggleSelection={toggleSelection}
            onUpdateQuantity={updateQuantity}
            onUpdateRemark={updateRemark}
          />
        </div >
      </div>
      <div className="bg-white p-4">
        <Button
          className="w-full"
          color="primary"
          form="form"
          isDisabled={!isChecked}
          isLoading={isPending}
          type="submit"
        >
          {t("submit")}
        </Button>

        <Checkbox isSelected={isChecked} size="sm" onValueChange={setIsChecked}>
          {t("acceptAgreement")}
        </Checkbox>
      </div>
    </>
  );
}
