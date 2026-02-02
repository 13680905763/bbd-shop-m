import React from "react";

import CouponCard from "./coupon-card";

import { BlockSpinner, EmptyState } from "@/components/ui";
import { useCouponsConfig } from "@/hook/api";

export default function PointsRecordContent() {
  const { data, isFetching } = useCouponsConfig();

  console.log("data", data);

  if (isFetching) return <EmptyState />;

  return (
    <>
      {isFetching && <BlockSpinner />}
      <div className="grid grid-cols-2 gap-2">
        {data?.map((coupon: any) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </>
  );
}
