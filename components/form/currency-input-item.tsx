import React from "react";
import { Input } from "@heroui/react";
import { useGlobalStore } from "@/store/global";

interface CurrencyInputItemProps {
  formData: any;
  onChange: (key: string, value: any) => void;
  name: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CurrencyInputItem({
  formData,
  onChange,
  name,
  label,
  placeholder = "0.00",
  errorMessage,
  required,
  isDisabled,
  size = "md",
}: CurrencyInputItemProps) {
  const { currency } = useGlobalStore();
  const value = formData[name] ?? "";

  const handleChange = (val: string) => {
    onChange(name, val);
  };

  return (
    <Input
      className="flex-1"
      classNames={{
        inputWrapper:
          "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
        input: "text-base",
        mainWrapper: "w-full",
      }}
      endContent={
        <div className="pointer-events-none flex items-center text-gray-400 text-2xl whitespace-nowrap">
          ≈ {currency.symbol}{" "}
          {currency.rate
            ? (parseFloat(value || "0") / currency.rate).toFixed(2)
            : "0.00"}
        </div>
      }
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      isRequired={required}
      label={label}
      // labelPlacement={label ? "outside" : undefined}
      placeholder={placeholder}
      size={size}
      startContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-gray-500 text-base font-medium">¥</span>
        </div>
      }
      type="number"
      value={value}
      onValueChange={handleChange}
    />
  );
}
