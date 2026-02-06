import { InfiniteScroll } from "antd-mobile";
import React from "react";

import { BlockSpinner, EmptyState } from "@/components/ui";
import { usePointsList } from "@/hook/api";

export default function PointsRecordContent() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    usePointsList();
  const records = data?.pages?.flatMap((page: any) => page?.records) ?? [];

  if (!records?.length && !isFetching) return <EmptyState />;

  return (
    <>
      {isFetching && <BlockSpinner />}
      <div className="space-y-2">
        {records.map((r: any) => (
          <div
            key={r?.id}
            className="rounded-lg bg-white px-4 py-3 shadow-sm transition-shadow"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-title !text-base font-medium text-gray-800">
                  {r?.bizType}
                </div>
                <div className="text-sm text-gray-500">{r?.createTime}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-money-xl font-semibold text-green-600">
                  {r?.amount > 0 ? `+${r?.amount}` : r?.amount}
                </p>
                {r?.status && (
                  <p className="text-sm text-gray-400">{r?.status}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <InfiniteScroll
        hasMore={!!hasNextPage}
        loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
      >
        {!hasNextPage && <EmptyState className="!h-auto" />}
      </InfiniteScroll>
    </>
  );
}
