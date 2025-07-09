import { request } from "./request";

import { PaymentMethodResponse } from "@/types";

export const getPaymentMethodList = (
  bizCode: string,
): Promise<PaymentMethodResponse[]> =>
  request.get("/customer/pay-order/preview?bizCode=" + bizCode);
