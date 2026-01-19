import {
  Input,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
} from "@heroui/react";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

import AreaSelector from "./area-selector";

export interface FieldOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FieldConfig {
  key?: string; // 用于 React 元素 key
  type: "input" | "password" | "select" | "checkbox" | "date" | "area";
  name: string; // 用于 formData
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  options?: FieldOption[];
  startContent?: React.ReactNode;
  errorMessage?: string;
  isDisabled?: boolean;
}

interface DynamicFormProps<T extends Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
}

export default function FormItemRenderer<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
}: DynamicFormProps<T>) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...formData, [key]: value });
  };
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {fields.map((field) => {
        const {
          type,
          name,
          label,
          placeholder,
          options = [],
          size = "md",
          startContent = "",
          required = false,
          errorMessage = "",
          isDisabled = false,
        } = field; // 默认 md
        const value = formData[name] ?? "";

        switch (type) {
          case "input":
            return (
              <Input
                key={name}
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-white",
                }}
                errorMessage={errorMessage}
                isRequired={required}
                label={label}
                placeholder={placeholder}
                size={size}
                startContent={startContent}
                value={value}
                variant="bordered"
                isDisabled={isDisabled}
                onValueChange={(val) => handleChange(name, val)}
              />
            );
          case "password":
            return (
              <Input
                key={name} // 用 name 作为 key
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-white",
                }}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-solid outline-transparent"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <HiEye className="pointer-events-none text-2xl text-default-400" />
                    ) : (
                      <HiEyeOff className="pointer-events-none text-2xl text-default-400" />
                    )}
                  </button>
                }
                errorMessage={errorMessage}
                isRequired={required}
                label={label}
                placeholder={placeholder}
                size={size}
                startContent={startContent}
                type={isVisible ? "text" : "password"}
                value={value}
                variant="bordered"
                onValueChange={(val) => handleChange(name, val)}
              />
            );
          case "select":
            return (
              <Autocomplete
                key={name}
                aria-label="select"
                classNames={{
                  base: "bg-white",
                }}
                label={label}
                placeholder={placeholder}
                selectedKey={value}
                size={size}
                variant="bordered"
                onSelectionChange={(val) => handleChange(name, val as string)}
              >
                {options.map((opt) => (
                  <AutocompleteItem
                    key={opt.value}
                    startContent={
                      opt.icon && (
                        <Avatar
                          alt={opt.label}
                          className="h-6 w-6"
                          src={opt.icon}
                        />
                      )
                    }
                  >
                    {opt.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            );
          case "checkbox":
            return (
              <Checkbox
                key={name}
                className="m-0"
                isSelected={!!value}
                size={size}
                onValueChange={(val) => handleChange(name, val)}
              >
                {label}
              </Checkbox>
            );
          case "date":
            return (
              <DatePicker
                key={name}
                classNames={{ inputWrapper: "focus-within:!border-[#f0700c]" }}
                label={label}
                size={size}
                variant="bordered"
              />
            );
          case "area":
            return (
              <AreaSelector
                key={name}
                value={{
                  countryId: formData.countryId ?? "",
                  stateId: formData.stateId ?? "",
                  city: formData.city ?? "",
                }}
                onChange={(val) => onChange({ ...formData, ...val })}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
