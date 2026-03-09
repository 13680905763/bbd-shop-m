import type { Address } from "@/types/address";

import { useTranslations } from "next-intl";
import { memo } from "react";

type SelectedAddressItemProps = {
  addressDetail: Address;
  selectable?: boolean;
  onClick?: () => void;
};

export default memo(function SelectedAddressItem({
  addressDetail,
}: SelectedAddressItemProps) {
  const t = useTranslations("components.itemList.addressItem");

  const fullCity =
    addressDetail.city === addressDetail.state
      ? `${addressDetail.country} ${addressDetail.state}`
      : `${addressDetail.country} ${addressDetail.state} ${addressDetail.city}`;
  const fullAddress = addressDetail.doorNo
    ? `${addressDetail.address} (${addressDetail.doorNo})`
    : addressDetail.address;

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <span>{addressDetail.recipient}</span>
          <span className="text-xs font-normal text-gray-500">
            {addressDetail.phone}
          </span>
        </div>
        {addressDetail.defaultAddress ? (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
            {t("default")}
          </span>
        ) : null}
      </div>
      <div className="truncate text-xs text-gray-600">
        {fullCity} {fullAddress}
      </div>
    </div>
  );
});
