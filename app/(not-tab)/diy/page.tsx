"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Form } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import FormItemRenderer, { FieldConfig } from "@/components/form/formItem-renderer";
import { useCreateDiyOrder, useUploadDiyImage, useOrderServicesList } from "@/hook/api";
import { SelectionServiceDrawer } from "@/components/drawer";
import useEnhancedSelection from "@/hook/common/useEnhancedSelection";
import SelectionBlock from "@/components/common/selection-block";
import { SelectedServiceItem } from "@/components/list-item";

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

    const { data: rawServicesList, isLoading: isServicesLoading } = useOrderServicesList();
    const {
        items: servicesList,
        toggleSelection,
        updateQuantity,
        updateRemark,
        getSelectedItems,
    } = useEnhancedSelection(rawServicesList || []);

    const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);

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
        const checkedServices = getSelectedItems()
            .map((item) => ({
                serviceId: item.id,
                quantity: item.quantity,
                remark: item.remark || "",
            }));

        const validSpecs = formData.specs
            .filter((spec) => spec.s1 || spec.s2)
            .map((spec) => ({
                s1: spec.s1,
                s2: spec.s2,
                quantity: typeof spec.quantity === 'string' ? parseInt(spec.quantity) : spec.quantity || 1
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
            <div className="flex-1 overflow-auto scrollbar-hide p-2 ">
                <Form
                    className="w-full space-y-2"
                    id="form"
                    onSubmit={handleSubmit}
                >

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
                            renderItem={(service: any) => (
                                <SelectedServiceItem
                                    key={service.id}
                                    service={service}
                                />
                            )}
                            isLoading={isServicesLoading}
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
                        <div className="mb-3 text-lg font-semibold">
                            {t("fee")}
                        </div>
                        <div className="space-y-2">
                            <FormItemRenderer
                                fields={feeFields}
                                formData={formData}
                                onChange={setFormData}
                            />
                        </div>


                    </div>
                    {/* <div className="w-full rounded-lg bg-white p-4">
                        <div className="flex justify-between items-center">
                            <span>{t("productFee")}:</span>
                            <span className="font-medium">
                                {currency.symbol} {formatPrice(productTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>{t("shippingFee")}:</span>
                            <span className="font-medium">
                                {currency.symbol} {formatPrice(shipping)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>{t("serviceFee")}:</span>
                            <span className="font-medium">
                                {currency.symbol} {serviceFee}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2 mt-1">
                            <span className="font-semibold text-gray-800">{t("totalCost")}:</span>
                            <span className="text-xl font-bold text-primary">
                                {currency.symbol} {formatPrice(parseFloat(totalAmount))}
                            </span>
                        </div>
                    </div> */}
                </Form>
            </div>
            <div className="bg-white p-4">
                <Button
                    color="primary"
                    className="w-full "
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
