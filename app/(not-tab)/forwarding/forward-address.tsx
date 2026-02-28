import React from "react";
import { useTranslations } from "next-intl";
import { IoCopyOutline } from "react-icons/io5";

import { CopyText } from "@/components/ui";
import { useUserInfo } from "@/hook/api";

export default function ForwardAddress() {
  const t = useTranslations("forwarding");
  const { data: userInfo } = useUserInfo();

  const addressInfo = {
    recipient: `代发-${userInfo?.nickName || ""}`,
    phone: "15916408071",
    address: "广东省惠州市惠城区水口荔枝城青创产业园9楼901",
  };

  const copyContent = `${addressInfo.recipient}\n${addressInfo.phone}\n${addressInfo.address}`;

  return (
    <div className="w-full rounded-lg bg-white p-4">
      <p className="mb-3 text-lg font-semibold">{t("forwardAddress")}</p>
      <div className="relative w-full rounded-large bg-[#f4f4f5] p-4 font-mono text-sm text-default-600">
        <div className="flex flex-col gap-1">
          <span>{addressInfo.recipient}</span>
          <span>{addressInfo.phone}</span>
          <span>{addressInfo.address}</span>
        </div>
        <CopyText
          className="absolute right-3 top-3 rounded-md p-1 text-default-400 transition-colors hover:bg-default-100 hover:text-default-700"
          text={copyContent}
        >
          <IoCopyOutline size={18} />
        </CopyText>
      </div>
    </div>
  );
}
