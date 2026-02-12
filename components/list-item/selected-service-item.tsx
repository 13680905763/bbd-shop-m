import { Image } from "antd-mobile";
import { useGlobalStore } from "@/store";
import React from "react";

export default function SelectedServiceItem({ service }: any) {
  const { currency } = useGlobalStore();

  return (
    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-2.5 transition hover:bg-gray-100/50">
      <div className="flex min-w-0 flex-1 gap-3">
        <Image
          alt={service.serviceName}
          className="flex-shrink-0 rounded-md object-cover ring-1 ring-gray-100"
          height={48}
          src={service.sample}
          width={48}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <span className="line-clamp-1 text-sm font-semibold text-gray-900">
              {service.serviceName}
            </span>
            <div className="flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-gray-900">
              <span>
                {currency.symbol}
                {service.price}
              </span>
              {service.stacked == 1 && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium">
                  x{service.quantity}
                </span>
              )}
            </div>
          </div>

          {service.remark && (
            <div className="mt-1 flex items-start gap-1 rounded bg-white px-2 py-1 text-xs text-gray-500 shadow-sm">
              <span className="line-clamp-2 break-all">{service.remark}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
