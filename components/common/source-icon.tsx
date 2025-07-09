"use client";

import React from "react";
import { AiOutlineAlibaba } from "react-icons/ai";
import { FaCircle } from "react-icons/fa";

// 按你的项目路径调整

interface SourceIconProps {
  source?: string;
  size?: number;
  className?: string;
}

const SourceIcon: React.FC<SourceIconProps> = ({
  source,
  size = 18,
  className = "",
}) => {
  if (!source) return null;

  switch (source.toUpperCase()) {
    case "TAOBAO":
      return (
        <div className="relative h-[18px] w-[18px]">
          <FaCircle className="h-full w-full bg-[#ff5000] text-[#ff5000]" />
          <span className="absolute inset-0 flex items-center justify-center font-bold text-white">
            淘
          </span>
        </div>
      );
    case "1688":
      return (
        <AiOutlineAlibaba
          className={`text-white ${className} bg-[#ff5000]`}
          size={size}
        />
      );
    default:
      return null;
  }
};

export default SourceIcon;
