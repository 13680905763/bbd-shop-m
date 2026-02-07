import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import React from "react";

interface AutocompleteItemProps {
  options: any[];
  isLoading?: boolean;
  value: string | number;
  onChange: (value: string | number) => void;
  label: string;
  name?: string;
  labelKey?: string;
  valueKey?: string;
  imageKey?: string;
  isRequired?: boolean;
  errorMessage?: string;
}

export default function CustomAutocompleteItem({
  options,
  isLoading,
  value,
  onChange,
  label,
  name,
  labelKey = "name",
  valueKey = "id",
  imageKey,
  isRequired,
  errorMessage,
}: AutocompleteItemProps) {
  return (
    <Autocomplete
      className="flex-1"
      defaultItems={options}
      errorMessage={errorMessage}
      inputProps={{
        classNames: {
          input: "text-base",
        },
      }}
      isDisabled={isLoading}
      isRequired={isRequired}
      label={label}
      name={name}
      selectedKey={String(value)}
      size="sm"
      onSelectionChange={(key) => onChange(key as string | number)}
    >
      {(item: any) => (
        <AutocompleteItem
          key={item[valueKey]}
          className="text-base"
          startContent={
            imageKey && item[imageKey] ? (
              <Avatar
                alt={item[labelKey]}
                className="h-6 w-6"
                src={item[imageKey]}
              />
            ) : null
          }
        >
          {item[labelKey]}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
