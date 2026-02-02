"use client";

import { useTranslations } from "next-intl";

interface TotalStatsCardProps {
  weight: number;
  volume: number;
}

export default function TotalStatsCard({
  weight = 0,
  volume = 0,
}: TotalStatsCardProps) {
  const t = useTranslations("submit.warehouse");

  return (
    <div className="mb-4 flex flex-wrap gap-4 rounded-xl border border-gray-100 bg-white p-4">
      <div className="min-w-[140px] flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100">
            <svg
              className="h-3 w-3 text-orange-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {t("totalWeight")}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800">
          {weight}
          <span className="ml-1 text-base font-normal text-gray-500">g</span>
        </p>
      </div>

      <div className="min-w-[140px] flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100">
            <svg
              className="h-3 w-3 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {t("totalVolume")}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800">
          {volume}
          <span className="ml-1 text-base font-normal text-gray-500">cm³</span>
        </p>
      </div>
    </div>
  );
}
