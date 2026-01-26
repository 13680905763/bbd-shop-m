import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";

import PaginationBar from "./pagination-bar";

import { BlockSpinner, EmptyState } from "@/components/ui";

interface Column {
  key: string;
  label: string;
}

interface CommonTableProps {
  columns: Column[];
  data: any;
  isLoading?: boolean;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  renderCell?: (item: any, columnKey: React.Key) => React.ReactNode;
}

export default function CommonTable({
  columns,
  data,
  isLoading = false,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  renderCell,
}: CommonTableProps) {
  console.log('isLoading', isLoading);
  console.log('data', data);
  console.log('columns', columns);
  const total = data?.total || 10;
  return (
    <Table
      className="relative"
      bottomContent={
        !isLoading &&
          total > 0 &&
          onPageChange &&
          onPageSizeChange ? (
          <div className="">
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={<EmptyState className="!h-auto" />}
        isLoading={isLoading}
        items={data?.records || []}
        loadingContent={<BlockSpinner />}
      >
        {(item: any) => (
          <TableRow key={item?.id || Math.random()}>
            {(columnKey) => (
              <TableCell>
                {renderCell
                  ? renderCell(item, columnKey)
                  : getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
