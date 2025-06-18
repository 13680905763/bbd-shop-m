import {
  Input,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
} from "@heroui/react";

import AreaSelector from "./area-selector";

export interface FieldOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FieldConfig {
  type: "input" | "select" | "checkbox" | "date" | "area";
  name: string;
  label: string;
  placeholder?: string;
  options?: FieldOption[];
}

interface DynamicFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function FormItemRenderer({
  fields,
  formData = {},
  onChange,
}: DynamicFormProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...formData, [key]: value });
  };

  console.log("formData", formData);

  return (
    <>
      {fields.map((field) => {
        const { type, name, label, placeholder, options = [] } = field;
        const value = formData[name] ?? "";

        switch (type) {
          case "input":
            return (
              <Input
                key={name}
                label={label}
                placeholder={placeholder}
                value={value}
                variant="bordered"
                onValueChange={(val) => handleChange(name, val)}
              />
            );
          case "select":
            return (
              <Autocomplete
                key={name}
                label={label}
                placeholder={placeholder}
                selectedKey={value}
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
                isSelected={!!value}
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
                variant="bordered"
                // 你可以根据需要实现日期回填与格式转换
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
                onChange={
                  (val) => onChange({ ...formData, ...val }) // 统一更新 3 个字段
                }
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
