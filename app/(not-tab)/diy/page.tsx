"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button, Form } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import FormItemRenderer, {
  FieldConfig,
} from "@/components/form/formItem-renderer";
import {
  useCreateDiyOrder,
  useUploadDiyImage,
  useOrderServicesList,
} from "@/hook/api";
import { SelectionServiceDrawer } from "@/components/drawer";
import useEnhancedSelection from "@/hook/common/useEnhancedSelection";
import SelectionBlock from "@/components/common/selection-block";
import { SelectedServiceItem } from "@/components/item-list";
import { useGlobalStore } from "@/store/global";

export default function DIYPage() {
  const t = useTranslations("diy");
  const router = useRouter();
  const { currency } = useGlobalStore();

  const [formData, setFormData] = useState({
    productLink: "",
    productName: "",
    specs: [{ s1: "", s2: "", quantity: "1" }],
    remark: "",
    images: [],
    productPrice: "",
    postage: "",
  });

  const { mutateAsync: createDiyOrder, isPending: isSubmitting } =
    useCreateDiyOrder();
  const { mutateAsync: uploadImage, isPending: uploading } =
    useUploadDiyImage();

  const { data: rawServicesList, isLoading: isServicesLoading } =
    useOrderServicesList();
  const {
    items: servicesList,
    toggleSelection,
    updateQuantity,
    updateRemark,
    getSelectedItems,
  } = useEnhancedSelection(rawServicesList || []);

  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);

  // ✅ 计算所有服务费的总和
  const totalServiceFee = useMemo(() => {
    return getSelectedItems()
      .reduce((acc, item) => {
        const fee = parseFloat(item.price || "0") * item.quantity;

        return acc + fee;
      }, 0)
      .toFixed(2);
  }, [servicesList]);

  const productFeeConverted = currency.rate
    ? parseFloat(formData.productPrice || "0") / currency.rate
    : 0;

  const shippingFeeConverted = currency.rate
    ? parseFloat(formData.postage || "0") / currency.rate
    : 0;

  const totalAmount = (
    productFeeConverted +
    shippingFeeConverted +
    parseFloat(totalServiceFee || "0")
  ).toFixed(2);

  const productFields: FieldConfig[] = [
    {
      type: "input",
      name: "productLink",
      label: t("fields.productLink.label"),
      errorMessage: t("fields.productLink.errorMessage"),
      placeholder: t("fields.productLink.placeholder"),
      required: true,
    },
    {
      type: "input",
      name: "productName",
      label: t("fields.productName.label"),
      errorMessage: t("fields.productName.errorMessage"),
      placeholder: t("fields.productName.placeholder"),
      required: true,
    },
    {
      type: "specifications",
      name: "specs",
      required: true,
    },
    {
      type: "textarea",
      name: "remark",
      label: t("fields.remark.label"),
      placeholder: t("fields.remark.placeholder"),
    },
    {
      type: "imageUpload",
      name: "images",
      config: {
        onUpload: uploadImage,
      },
    },
  ];

  const feeFields: FieldConfig[] = [
    {
      type: "currencyInput",
      name: "productPrice",
      label: t("fields.productPrice.label"),
      placeholder: "0.00",
      required: true,
      errorMessage: t("fields.productPrice.errorMessage"),
    },
    {
      type: "currencyInput",
      name: "postage",
      label: t("fields.postage.label"),
      placeholder: "0.00",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkedServices = getSelectedItems().map((item) => ({
      serviceId: item.id,
      quantity: item.quantity,
      remark: item.remark || "",
    }));

    const validSpecs = formData.specs
      .filter((spec) => spec.s1 || spec.s2)
      .map((spec) => ({
        s1: spec.s1,
        s2: spec.s2,
        quantity:
          typeof spec.quantity === "string"
            ? parseInt(spec.quantity)
            : spec.quantity || 1,
      }));

    const productPic = formData.images.map((img: any) => img.preview);

    const bizCode = await createDiyOrder({
      productLink: formData.productLink,
      productTitle: formData.productName,
      productPic,
      specifications: validSpecs,
      productPrice: formData.productPrice || "0",
      postage: formData.postage || "0",
      remark: formData.remark,
      serviceList: checkedServices,
    });

    // Redirect to payment page
    if (bizCode) {
      router.push(`/payment/${bizCode}`);
    }
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto p-2 scrollbar-hide">
        <Form className="w-full space-y-2" id="form" onSubmit={handleSubmit}>
          <div className="w-full rounded-lg bg-white p-4">
            <div className="mb-3 text-lg font-semibold">
              {t("productDetails")}
            </div>
            <div className="space-y-2">
              <FormItemRenderer
                fields={productFields}
                formData={formData}
                onChange={setFormData}
              />
            </div>
          </div>
          <div className="w-full">
            <SelectionBlock
              data={servicesList.filter((s) => s.isSelected)}
              isLoading={isServicesLoading}
              renderItem={(service: any) => (
                <SelectedServiceItem key={service.id} service={service} />
              )}
              title={t("extraServices")}
              onClick={() => setIsServiceSelectionOpen(true)}
            />
          </div>
          <SelectionServiceDrawer
            isOpen={isServiceSelectionOpen}
            items={servicesList}
            onOpenChange={setIsServiceSelectionOpen}
            onToggleSelection={toggleSelection}
            onUpdateQuantity={updateQuantity}
            onUpdateRemark={updateRemark}
          />
          <div className="w-full rounded-lg bg-white p-4">
            <div className="mb-3 text-lg font-semibold">{t("fee")}</div>
            <div className="space-y-2">
              <FormItemRenderer
                fields={feeFields}
                formData={formData}
                onChange={setFormData}
              />
            </div>
          </div>
          <div className="w-full rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t("productFee")}</span>
              <span className="font-medium">
                {currency.symbol} {productFeeConverted.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-gray-600">{t("shippingFee")}</span>
              <span className="font-medium">
                {currency.symbol} {shippingFeeConverted.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-gray-600">{t("serviceFee")}</span>
              <span className="font-medium">
                {currency.symbol} {totalServiceFee}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-3">
              <span className="text-base font-semibold text-gray-800">
                {t("totalCost")}
              </span>
              <span className="text-2xl font-bold text-primary">
                {currency.symbol} {totalAmount}
              </span>
            </div>
          </div>
        </Form>
      </div>
      <div className="bg-white p-4">
        <Button
          className="w-full"
          color="primary"
          form="form"
          isLoading={isSubmitting}
          type="submit"
        >
          {t("submit")}
        </Button>
      </div>
    </>
  );
}
