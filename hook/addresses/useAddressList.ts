import { useQuery } from "../api/useQuery";

export interface Address {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
}

export const useAddressList = () =>
  useQuery<Address[]>("/customer/address/list?addressType=1");
