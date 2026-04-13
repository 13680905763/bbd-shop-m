"use client";

import React from "react";
import { Pagination, Select, SelectItem } from "@heroui/react";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export default function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4">
      <Pagination
        showControls
        page={page}
        total={Math.ceil(Number(total) / Number(pageSize))}
        onChange={onPageChange}
      />
      <Select
        aria-label="PaginationBar"
        className="max-w-[100px]"
        selectedKeys={[`${pageSize}`]}
        onChange={(e) => {
          const size = Number(e.target.value) || Number(pageSize);

          if (onPageChange) {
            onPageChange(1); // 改变页大小后重置为第一页
          }
          if (onPageSizeChange) {
            onPageSizeChange(size);
          }
        }}
      >
        {["10", "20", "50", "100"].map((size) => (
          <SelectItem key={size}>{size}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
