import {
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
} from "@heroui/react";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

import AreaSelector from "./area-selector";
import CustomAutocompleteItem from "./autocomplete-item";
import DimensionItem from "./dimension-item";
import SpecificationItem from "./specification-item";
import ImageUploadItem from "./image-upload-item";
import CurrencyInputItem from "./currency-input-item";
import VerificationCodeItem from "./verification-code-item";
import { validateField } from "./utils";

export interface FieldOption {
  label: string;
  value: string;
  icon?: string;
  [key: string]: any;
}

export interface FieldConfig {
  key?: string; // 用于 React 元素 key
  type:
    | "input"
    | "password"
    | "select"
    | "checkbox"
    | "date"
    | "area"
    | "autocomplete"
    | "dimensions"
    | "textarea"
    | "specifications"
    | "imageUpload"
    | "currencyInput"
    | "verificationCode";
  name: string; // 用于 formData
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  options?: any[];
  startContent?: React.ReactNode;
  errorMessage?: string;
  inputType?: string; // e.g. "number", "email", etc.
  isDisabled?: boolean;
  labels?: {
    weight: string;
    length: string;
    width: string;
    height: string;
  };
  config?: {
    labelKey?: string;
    valueKey?: string;
    imageKey?: string;
    onUpload?: (file: File) => Promise<string>;
    onSendCode?: () => Promise<void>;
    sendCodeText?: string;
    isSendDisabled?: boolean;
  };
}

interface DynamicFormProps<T extends Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
  isSubmitted?: boolean;
  errors?: Record<string, string>;
}

export default function FormItemRenderer<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
  isSubmitted,
  errors,
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
          errorMessage: defaultErrorMessage = "",
          inputType,
          isDisabled = false,
        } = field; // 默认 md
        const value = formData[name] ?? "";
        const errorMessage = errors?.[name] || defaultErrorMessage;

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
                isDisabled={isDisabled}
                isRequired={required}
                label={label}
                placeholder={placeholder}
                size={size}
                startContent={startContent}
                type={inputType}
                value={value}
                variant="bordered"
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
                  state: formData.state ?? "",
                  city: formData.city ?? "",
                }}
                onChange={(val) => {
                  const newData = { ...formData, ...val };
                  if (!newData.stateId) {
                    delete newData.stateId;
                  }
                  if (!newData.state) {
                    delete newData.state;
                  }
                  onChange(newData);
                }}
              />
            );
          case "autocomplete":
            return (
              <CustomAutocompleteItem
                key={name}
                errorMessage={errorMessage}
                imageKey={field.config?.imageKey}
                isLoading={isDisabled}
                isRequired={required}
                label={label || ""}
                labelKey={field.config?.labelKey}
                name={name}
                options={options}
                value={value}
                valueKey={field.config?.valueKey}
                onChange={(val) => handleChange(name, val)}
              />
            );
          case "dimensions": {
            const isValid = validateField(field, formData);
            const isInvalid = !isValid;

            return (
              <DimensionItem
                key={name}
                errorMessage={errorMessage}
                formData={formData}
                isInvalid={required && isInvalid && !!isSubmitted}
                labels={
                  field.labels || {
                    weight: "Weight",
                    length: "Length",
                    width: "Width",
                    height: "Height",
                  }
                }
                onChange={handleChange}
              />
            );
          }

          case "textarea":
            return (
              <Textarea
                key={name}
                classNames={{
                  input: "text-base",
                  inputWrapper: "bg-white",
                }}
                errorMessage={errorMessage}
                isDisabled={isDisabled}
                isRequired={required}
                label={label}
                placeholder={placeholder}
                size={size}
                value={value}
                variant="bordered"
                onValueChange={(val) => handleChange(name, val)}
              />
            );
          case "specifications":
            return (
              <SpecificationItem
                key={name}
                errorMessage={errorMessage}
                formData={formData}
                isRequired={required}
                name={name}
                onChange={handleChange}
              />
            );
          case "imageUpload":
            return (
              <ImageUploadItem
                key={name}
                formData={formData}
                label={label}
                name={name}
                onChange={handleChange}
                onUpload={field.config?.onUpload}
              />
            );
          case "currencyInput":
            return (
              <CurrencyInputItem
                key={name}
                errorMessage={errorMessage}
                formData={formData}
                isDisabled={isDisabled}
                label={label}
                name={name}
                placeholder={placeholder}
                required={required}
                size={size}
                onChange={handleChange}
              />
            );
          case "verificationCode":
            return (
              <VerificationCodeItem
                key={name}
                errorMessage={errorMessage}
                isDisabled={isDisabled}
                isSendDisabled={field.config?.isSendDisabled}
                label={label}
                placeholder={placeholder}
                required={required}
                sendCodeText={field.config?.sendCodeText}
                size={size}
                value={value}
                onChange={(val) => handleChange(name, val)}
                onSendCode={field.config?.onSendCode}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
