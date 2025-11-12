import { request } from "./request";

export const getCurrency = () => {
  return request.get("/rate");
};
