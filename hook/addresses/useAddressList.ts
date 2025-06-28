import { useQuery } from "../api/useQuery";

export interface Address {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
}
export const useAddressList = (addressType: number) =>
  useQuery<any[]>(`/customer/address/list?addressType=${addressType}`);
