// components/AreaSelector/hooks.ts

import { useQuery } from "../api/useQuery";

export const useCountries = () => useQuery("/countries/list");
export const useProvinces = (countryId?: string) =>
  useQuery(countryId ? `/state/country?countryId=${countryId}` : null);
export const useCities = (stateId?: string) =>
  useQuery(stateId ? `/cities/state?stateId=${stateId}` : null);
