import React from "react";

interface ProgressBarProps {
  steps?: string[];
  tipText?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  steps = ["付款产品", "提交包裹", "包裹收到"],
  tipText = "我们免费提供3-7张高清质检照片",
}) => {
  return (
    <div className="m-2 p-2 bg-white rounded-lg">
      <div className="w-full h-[2.3125rem] flex items-center justify-between">
        <div className="w-1/2 flex">
          <div className="w-full h-[2.3125rem] bg-[#fff7ef] flex items-center justify-center font-normal text-sm text-[#f0700c]">
            从卖家到BBD
          </div>
          <div className="w-0 h-0 right-[-1.15625rem] border-t-[1.15625rem] border-t-transparent border-b-[1.15625rem] border-b-transparent border-l-[1.15625rem] border-l-[#fff7ef]" />
        </div>
        <div className="w-1/2 flex relative">
          <div className="absolute left-0 border-l-white w-0 h-0 right-[-1.15625rem] border-t-[1.15625rem] border-t-transparent border-b-[1.15625rem] border-b-transparent border-l-[1.15625rem] border-l-[#ffefdb]" />
          <div className="w-full h-[2.3125rem] bg-[#ffefdb] flex items-center justify-center font-normal text-sm text-[#f0700c]">
            从BBD到您
          </div>
          <div className="w-0 h-0 right-[-1.15625rem] border-t-[1.15625rem] border-t-transparent border-b-[1.15625rem] border-b-transparent border-l-[1.15625rem] border-l-[#ffefdb]" />
        </div>
      </div>

      <div className="w-[13.6875rem] flex items-center justify-between relative mt-[0.625rem] mx-auto mb-[1.875rem] after:content-[''] after:absolute after:w-full after:border-b after:border-dashed after:border-[#f0700c]">
        {steps.map((text, index) => (
          <div
            key={index}
            className="relative w-2 h-2 rounded-full bg-[#f0700c]"
          >
            <span className="absolute left-1/2 bottom-[-1.25rem] transform -translate-x-1/2 text-center font-normal text-xs text-[#333] whitespace-nowrap">
              {text}
            </span>
          </div>
        ))}
      </div>

      <div className="min-h-[2.3125rem] bg-[#fef6df] rounded-[0.3125rem] flex items-center justify-center font-normal text-xs text-[#c27d37]">
        {tipText}
      </div>
    </div>
  );
};

export default ProgressBar;
