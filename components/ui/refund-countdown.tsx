"use client";

import { useCountDown } from "ahooks";
import { useTranslations } from "next-intl";

interface RefundCountdownProps {
  timestamp: number | string;
}

export default function RefundCountdown({ timestamp }: RefundCountdownProps) {
  const t = useTranslations("components.ui.refundCountdown");

  const [timeLeft, formattedRes] = useCountDown({
    targetDate: Number(timestamp),
  });

  const { days, hours, minutes, seconds } = formattedRes;

  // 如果已经过期，显示过期状态
  if (timeLeft === 0) {
    return <span className="ml-1 text-xs text-red-500">({t("expired")})</span>;
  }

  return (
    <span style={{ fontSize: "12px", color: "inherit", lineHeight: "inherit" }}>
      ({days} {t("day")} {hours} {t("hour")} {minutes} {t("minute")} {seconds}{" "}
      {t("second")})
    </span>
  );
}
