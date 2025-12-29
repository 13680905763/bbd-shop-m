import React from "react";
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
  steps?: string[];
  tipText?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "goods.progressBar",
  });
  const steps = [t("step1"), t("step2"), t("step3")];

  return (
    <div className="rounded-lg bg-white p-2">
      <div className="flex h-[2.3125rem] w-full items-center justify-between">
        <div className="flex w-1/2">
          <div className="flex h-[2.3125rem] w-full items-center justify-center bg-[#fff7ef] text-sm font-normal text-[#f0700c]">
            {t("fromSellerToBBD")}
          </div>
          <div className="right-[-1.15625rem] h-0 w-0 border-b-[1.15625rem] border-l-[1.15625rem] border-t-[1.15625rem] border-b-transparent border-l-[#fff7ef] border-t-transparent" />
        </div>
        <div className="relative flex w-1/2">
          <div className="absolute left-0 right-[-1.15625rem] h-0 w-0 border-b-[1.15625rem] border-l-[1.15625rem] border-t-[1.15625rem] border-b-transparent border-l-[#ffefdb] border-l-white border-t-transparent" />
          <div className="flex h-[2.3125rem] w-full items-center justify-center bg-[#ffefdb] text-sm font-normal text-[#f0700c]">
            {t("fromBBDToYou")}
          </div>
          <div className="right-[-1.15625rem] h-0 w-0 border-b-[1.15625rem] border-l-[1.15625rem] border-t-[1.15625rem] border-b-transparent border-l-[#ffefdb] border-t-transparent" />
        </div>
      </div>

      <div className="relative mx-auto mb-[1.875rem] mt-[0.625rem] flex w-[13.6875rem] items-center justify-between after:absolute after:w-full after:border-b after:border-dashed after:border-[#f0700c] after:content-['']">
        {steps.map((text, index) => (
          <div
            key={index}
            className="relative h-2 w-2 rounded-full bg-[#f0700c]"
          >
            <span className="absolute bottom-[-1.25rem] left-1/2 -translate-x-1/2 transform whitespace-nowrap text-center text-xs font-normal text-[#333]">
              {text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex min-h-[2.3125rem] items-center justify-center rounded-[0.3125rem] bg-[#fef6df] text-xs font-normal text-[#c27d37]">
        {t("tipText")}
      </div>
    </div>
  );
};

export default ProgressBar;
