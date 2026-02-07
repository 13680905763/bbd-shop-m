import { Input } from "@heroui/react";
import React from "react";

interface DimensionItemProps {
  formData: any;
  onChange: (key: string, value: any) => void;
  labels: {
    weight: string;
    length: string;
    width: string;
    height: string;
  };
  errorMessage?: string;
  isInvalid?: boolean;
}

export default function DimensionItem({
  formData,
  onChange,
  labels,
  errorMessage,
  isInvalid,
}: DimensionItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 gap-2">
        <Input
          className="flex-1 text-base"
          classNames={{
            input: "text-base",
          }}
          isInvalid={isInvalid}
          label={labels.weight}
          name="weight"
          size="sm"
          type="number"
          value={formData.weight}
          onChange={(e) => onChange("weight", e.target.value)}
        />
        <Input
          className="flex-1 text-base"
          classNames={{
            input: "text-base",
          }}
          isInvalid={isInvalid}
          label={labels.length}
          name="length"
          size="sm"
          type="number"
          value={formData.length}
          onChange={(e) => onChange("length", e.target.value)}
        />
      </div>
      <div className="flex flex-1 gap-2">
        <Input
          className="flex-1 text-base"
          classNames={{
            input: "text-base",
          }}
          isInvalid={isInvalid}
          label={labels.width}
          name="width"
          size="sm"
          type="number"
          value={formData.width}
          onChange={(e) => onChange("width", e.target.value)}
        />
        <Input
          className="flex-1 text-base"
          classNames={{
            input: "text-base",
          }}
          isInvalid={isInvalid}
          label={labels.height}
          name="height"
          size="sm"
          type="number"
          value={formData.height}
          onChange={(e) => onChange("height", e.target.value)}
        />
      </div>
      {isInvalid && errorMessage && (
        <div className="text-tiny text-danger">{errorMessage}</div>
      )}
    </div>
  );
}
