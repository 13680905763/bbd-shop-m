"use client";
import * as React from "react";
import { Image } from "@heroui/react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({ size = 36, width, height }) => (
  <Image
    alt="HeroUI hero Image"
    height={height || size}
    src="https://bbdbuy.com/uploads/20241228/6d32e25a7b3730177117fd5f5cf8f006.png"
    width={width || size}
  />
);
