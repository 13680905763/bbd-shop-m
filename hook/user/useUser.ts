import { useQuery } from "../api/useQuery";

export const useUser = () => useQuery("/customer/detail");
