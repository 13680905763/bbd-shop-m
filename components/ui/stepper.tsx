"use client";

import { useState, useEffect, KeyboardEvent } from "react";

interface SimpleStepperProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function Stepper({
  value,
  onChange,
  min = 1,
  max = 99999,
  className = "",
}: SimpleStepperProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  // 同步外部 value 变化到 input
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);

    onChange?.(newValue);
  };

  const handleIncrement = () => {
    onChange?.(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    // 解析输入值
    const parsedValue = parseInt(inputValue, 10);

    if (isNaN(parsedValue)) {
      // 如果不是数字，恢复原值
      setInputValue(value.toString());
    } else if (parsedValue < min) {
      // 如果小于最小值，设为最小值
      onChange?.(min);
    } else if (parsedValue > max) {
      // 如果大于最大值，设为最大值
      onChange?.(max);
    } else {
      // 否则使用新值
      onChange?.(parsedValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // 触发 blur 事件处理
    }
  };

  return (
    <div
      className={`flex items-center overflow-hidden rounded-lg border-gray-300 bg-gray-100 ${className}`}
      role="button"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="flex h-7 w-7 items-center justify-center text-xl text-gray-600 hover:bg-gray-200 disabled:opacity-30"
        disabled={value <= min}
        type="button"
        onClick={handleDecrement}
      >
        -
      </button>

      <input
        aria-label="Stepper value"
        className="w-9 border-none bg-transparent px-1 text-center !text-base text-sm text-gray-900 outline-none"
        type="text"
        value={inputValue}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <button
        className="flex h-7 w-7 items-center justify-center text-xl text-gray-600 hover:bg-gray-200 disabled:opacity-30"
        disabled={value >= max}
        type="button"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
}
