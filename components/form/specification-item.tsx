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
  const specifications: SpecItem[] =
    Array.isArray(formData[name]) && formData[name].length > 0
      ? formData[name]
      : [{ s1: "", s2: "", quantity: "1" }];

  const handleSpecChange = (
    index: number,
    field: keyof SpecItem,
    value: string,
  ) => {
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
    <div className="flex w-full flex-col gap-2">
      {specifications.map((spec, index) => (
        <div key={index} className="flex w-full items-center gap-2">
          <Input
            className="flex-1"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            label={t("s1")}
            onValueChange={(val) => handleSpecChange(index, "s1", val)}
            isRequired={isRequired}
            // placeholder={t("s1")}
            variant="bordered"
            value={spec.s1}
            // isInvalid={!!errorMessage}
            errorMessage={t("s1")}
          />
          <Input
            className="flex-1"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            errorMessage={t("s2")}
            size="md"

            variant="bordered"
            isRequired={isRequired}
            // placeholder={t("s2")}
            label={t("s2")}
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
            isInvalid={!!errorMessage}
            isRequired={isRequired}
            label={t("quantity")}
            placeholder={t("quantity")}
            size="md"
            type="number"
            value={spec.quantity?.toString() ?? ""}
            variant="bordered"
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
