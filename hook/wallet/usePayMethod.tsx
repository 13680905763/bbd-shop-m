import { useQuery } from "../api/useQuery";

export const usePayMethod = () => useQuery("/payment/list/group");
