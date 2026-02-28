import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IoLocationOutline, IoSwapHorizontalOutline } from "react-icons/io5";

import CommonModal from "@/components/modal/common-modal";
import ActionItem from "./action-item";

export type MoreActionType = "changeLine" | "changeAddress";

interface MoreActionsProps {
    isOpen: boolean;
    onClose: () => void;
    currentWaybill: any;
    onAction: (waybill: any, type: MoreActionType) => Promise<void>;
}

export default function MoreActions({
    isOpen,
    onClose,
    currentWaybill,
    onAction,
}: MoreActionsProps) {
    const t = useTranslations("profile.package.moreActions");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isDisabledChangeLine = !currentWaybill?.changeFlag;     // 禁用"修改线路"
    const isDisabledChangeAddress = !currentWaybill?.addressFlag; // 禁用"修改地址"

    const handleAction = async (type: MoreActionType) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await onAction(currentWaybill, type);
        } finally {
            setIsLoading(false);
        }
    };

    const actions = [
        {
            key: "changeLine",
            title: t("changeLine.title"),
            description: t("changeLine.description"),
            icon: <IoSwapHorizontalOutline className="h-6 w-6" />,
            isDisabled: isDisabledChangeLine,
            onPress: () => handleAction("changeLine"),
        },
        {
            key: "changeAddress",
            title: t("changeAddress.title"),
            description: t("changeAddress.description"),
            icon: <IoLocationOutline className="h-6 w-6" />,
            isDisabled: isDisabledChangeAddress,
            onPress: () => handleAction("changeAddress"),
        },
    ];

    return (
        <CommonModal
            footer={<div />}
            isOpen={isOpen}
            title={t("title")}
            onOpenChange={onClose}
        >
            <div className="flex flex-col gap-4">
                {actions.map((action) => (
                    <ActionItem
                        key={action.key}
                        description={action.description}
                        icon={action.icon}
                        isDisabled={action.isDisabled || isLoading}
                        title={action.title}
                        onPress={action.onPress}
                    />
                ))}
            </div>
        </CommonModal>
    );
}

