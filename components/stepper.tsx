"use client";
import { Button } from "@heroui/react";
import { useState } from "react";

type StepperProps = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

export default function Stepper({
  value = 1,
  min = 1,
  max = Infinity,
  onChange,
  disabled = false,
}: StepperProps) {
  const [count, setCount] = useState(value);
  const handleChange = (val: number) => {
    const clamped = Math.max(min, Math.min(val, max));

    setCount(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="flex flex-1  border border-gray-200">
      <Button
        isIconOnly
        className="px-2 text-lg disabled:opacity-30 bg-[#f5f7fa] border-r border-gray-200"
        disabled={disabled || count <= min}
        radius="none"
        size="sm"
        onPress={() => handleChange(count - 1)}
      >
        –
      </Button>
      <input
        className="w-12 text-center border-none outline-none bg-transparent flex-1"
        disabled={disabled}
        max={max}
        min={min}
        type="number"
        value={count}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <Button
        isIconOnly
        className="px-2 text-lg disabled:opacity-30 bg-[#f5f7fa] border-r border-gray-200"
        disabled={disabled || count >= max}
        radius="none"
        size="sm"
        onPress={() => handleChange(count + 1)}
      >
        +
      </Button>
    </div>
  );
}
