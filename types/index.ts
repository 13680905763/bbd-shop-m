import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export * from "./order";
export * from "./user";
export * from "./wallet";
export * from "./pay";

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  msg: string;
  data: T;
}
