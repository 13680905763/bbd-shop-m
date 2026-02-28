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

import { FieldConfig } from "../form/formItem-renderer";
import FormItemRenderer from "../form/formItem-renderer";
import { useVisualViewport } from "@/hook/common";

import { useAddAddress, useUpdateAddress } from "@/hook/api";
import { validateField } from "../form/utils";

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

export default function EditAddressDrawer({
    isOpen,
    onOpenChange,
    type,
    defaultData,
}: AddressModalProps) {
    const t = useTranslations("components.modal.address");
    const t2 = useTranslations("components.modal");

    const { mutateAsync: addAddressMutate } = useAddAddress();
    const { mutateAsync: updateAddressMutate } = useUpdateAddress();

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
        // 校验所有字段
        const isValid = addressFields.every((field) => validateField(field, formData));
        if (!isValid) return;
        const { createTime, updateTime, customerId, ...filteredData } = formData;
        try {
            if (type === "add") {
                await addAddressMutate({
                    ...formData,
                    defaultAddress: filteredData.defaultAddress ? 1 : 0,
                });
            } else if (type === "edit") {
                await updateAddressMutate({
                    ...filteredData,
                    defaultAddress: filteredData.defaultAddress ? 1 : 0,
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
                                fields={addressFields}
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
