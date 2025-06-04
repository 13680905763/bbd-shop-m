"use client";
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
    <div className="flex flex-1">
      <button
        className="h-6 w-6 bg-transparent text-base disabled:opacity-30"
        disabled={disabled || count <= min}
        onClick={() => handleChange(count - 1)}
      >
        –
      </button>
      <input
        className="w-10 flex-1 bg-[#f8f8f8] text-center outline-none"
        disabled={disabled}
        max={max}
        min={min}
        type="number"
        value={count}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <button
        // isIconOnly
        className="h-6 w-6 bg-transparent text-base disabled:opacity-30"
        disabled={disabled || count >= max}
        // radius="none"
        onClick={() => handleChange(count + 1)}
      >
        +
      </button>
    </div>
  );
}
