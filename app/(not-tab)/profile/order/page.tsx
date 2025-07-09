"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Tab, Tabs } from "@heroui/react";

import OrderItem from "./order-item";

import { SearchIcon } from "@/components/icons";
import { useOrderList } from "@/hook";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function Settingpage() {
  // 传入订单状态，例如 "ALL"、"WAIT_PAY"
  const [activeTab, setActiveTab] = useState("all");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useOrderList(tabKeyToStatusCode[activeTab]);

  const router = useRouter();

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };
  const orders = data?.pages?.flatMap((page: any) => page.records) ?? [];

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        代购订单
      </NavBar>
      <div className="bg-white px-2">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100 ",
            input: "text-sm",
          }}
          endContent={
            <Button
              isIconOnly
              color="primary"
              size="sm"
              type="submit"
              variant="light"
            >
              搜索
            </Button>
          }
          labelPlacement="outside"
          name="url"
          placeholder="Search..."
          startContent={
            <SearchIcon className="pointer-events-none flex-shrink-0 text-base text-default-400" />
          }
          type="search"
        />
      </div>
      <Tabs
        aria-label="Options"
        classNames={{
          base: " w-full bg-white p-1",
          tabList: "gap-6 w-full relative rounded-none p-0 justify-center",

          tab: " px-0 h-12 flex-1",
          cursor: "h-0",
          tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
          panel: "bg-[#f7f8f9] px-2",
        }}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(String(key))}
      >
        <Tab key="photos" title="全部">
          {orders?.map((order: any) => (
            <OrderItem
              key={order.id}
              order={order}
              onPayOrderRedirect={onPayOrderRedirect}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
          />
        </Tab>

        <Tab key="waitPay" title="待付款">
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              order={order}
              onPayOrderRedirect={onPayOrderRedirect}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={() => fetchNextPage().then(() => undefined)}
          />
        </Tab>
        <Tab key="paid" title="已付款">
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              order={order}
              onPayOrderRedirect={onPayOrderRedirect}
            />
          ))}
          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={() => fetchNextPage().then(() => undefined)}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
