// services/address.ts

import axios from "axios";

import { request } from "./request";

export const addAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/add", data);
};

export const updateAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/update", data);
};

export const deleteAddress = (data: any): Promise<string> => {
  return request.post(`/customer/address/delete`, data);
};
export const getAddressList = (addressType: number): Promise<any> => {
  return request.get("/customer/address/list?addressType=" + addressType);
};
export const getCountries = async (): Promise<any> => {
  try {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/countries.json",
    );

    console.log("countries", data);

    return data;
  } catch (err) {
    console.error("获取国家列表失败", err);

    return [];
  }
};
export const getProvinces = (countryId: string): Promise<any> => {
  return request.get("/state/country?countryId=" + countryId);
};
export const getCities = (stateId: string): Promise<any> => {
  return request.get("/cities/state?stateId=" + stateId);
};
