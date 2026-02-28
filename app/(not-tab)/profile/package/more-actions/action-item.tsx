import React, { useState } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";

interface ActionItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    isDisabled?: boolean;
    onPress: () => Promise<void> | void;
}

export default function ActionItem({
    title,
    description,
    icon,
    isDisabled = false,
    onPress,
}: ActionItemProps) {
    const [isLoading, setIsLoading] = useState(false);
    const handlePress = async () => {
        if (isDisabled || isLoading) return;
        setIsLoading(true);
        try {
            await onPress();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card
            shadow='none'
            className="border-1"
            isDisabled={isDisabled}
            isPressable={!isDisabled && !isLoading}
            onPress={handlePress}
        >
            <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-full flex items-center justify-center w-12 h-12 bg-orange-100">
                    {isLoading ? (
                        <Spinner size="sm" />
                    ) : (
                        <div className="text-[#f0700c]">
                            {icon}
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 text-left">
                    <span className="font-semibold">
                        {title}
                    </span>
                    <span className="text-xs text-gray-500">
                        {description}
                    </span>
                </div>
            </CardBody>
        </Card >
    );
}
