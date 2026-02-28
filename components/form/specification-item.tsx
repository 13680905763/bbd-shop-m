import { Input, Button } from "@heroui/react";
import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface SpecItem {
  s1: string;
  s2: string;
  quantity: number | string;
}

interface SpecificationItemProps {
  formData: any;
  onChange: (key: string, value: any) => void;
  name: string;
  label?: string;
  errorMessage?: string;
  isRequired?: boolean;
}

export default function SpecificationItem({
  formData,
  onChange,
  name,
  errorMessage,
  isRequired,
}: SpecificationItemProps) {
  const t = useTranslations("components.form.specification");

  // Ensure specifications is an array, default to one item with quantity 1 if not present
  const specifications: SpecItem[] = Array.isArray(formData[name]) && formData[name].length > 0
    ? formData[name]
    : [{ s1: "", s2: "", quantity: "1" }];

  const handleSpecChange = (index: number, field: keyof SpecItem, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    onChange(name, newSpecs);
  };


  const handleAddSpec = () => {
    const newSpecs = [...specifications, { s1: "", s2: "", quantity: "1" }];
    onChange(name, newSpecs);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    onChange(name, newSpecs);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {specifications.map((spec, index) => (
        <div key={index} className="flex gap-2 items-center w-full">
          <Input
            className="flex-1"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            label={t("s1")}
            isRequired={isRequired}
            // placeholder={t("s1")}
            variant="bordered"
            value={spec.s1}
            // isInvalid={!!errorMessage}
            errorMessage={t("s1")}
            onValueChange={(val) => handleSpecChange(index, "s1", val)}
          />
          <Input
            className="flex-1"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            isRequired={isRequired}
            // placeholder={t("s2")}
            label={t("s2")}
            errorMessage={t("s2")}

            size="md"
            variant="bordered"
            value={spec.s2}
            // isInvalid={!!errorMessage}
            onValueChange={(val) => handleSpecChange(index, "s2", val)}
          />
          <Input
            className="w-20 shrink-0"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            isRequired={isRequired}
            placeholder={t("quantity")}
            label={t("quantity")}
            size="md"
            type="number"
            variant="bordered"
            value={spec.quantity?.toString() ?? ""}
            isInvalid={!!errorMessage}
            onValueChange={(val) => handleSpecChange(index, "quantity", val)}
          />
          {specifications.length > 1 && (
            <Button
              isIconOnly
              size="md"
              variant="light"
              onPress={() => handleRemoveSpec(index)}
            >
              <FaTrash size={16} />
            </Button>
          )}
        </div>
      ))}
      <Button
        className="button-default"
        color="primary"
        startContent={<FaPlus />}
        onPress={handleAddSpec}
      >
        {t("add")}
      </Button>
      {/* {errorMessage && (
        <div className="text-tiny text-danger px-1">{errorMessage}</div>
      )} */}
    </div>
  );
}
