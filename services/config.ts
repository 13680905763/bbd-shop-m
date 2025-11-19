import { request } from "./request";

export const getCurrency = () => {
  return request.get("/rate");
};
export const getCategory = () => {
  return request.get("/cargo-category");
};
