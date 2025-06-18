// hooks/useCart.ts

import { useQuery } from "../api/useQuery";

import { Shop } from "@/app/(tab)/cart/page";

export const useCart = () => useQuery<Shop[]>("/customer/cart/shop");
