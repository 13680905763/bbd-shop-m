"use client";
import { NavBar } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Tab, Tabs } from "@heroui/react";

import OrderItem from "./order-item";

import { useUser } from "@/hook/user/useUser";
import { SearchIcon } from "@/components/icons";
import { getOrderList } from "@/services";

export default function Settingpage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError } = useUser();
  const [orderList, setOrderList] = useState<any>([]);

  const router = useRouter();

  const [formData, setFormData] = useState({});
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };

  useEffect(() => {
    getOrderList({ current: page, size: pageSize }).then((res) => {
      console.log("res", res);

      setOrderList(res.data.records);
    });
  }, [page, pageSize]);
  useEffect(() => {
    setFormData(data);
  }, [data]);
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

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
        }}
        variant="underlined"
      >
        <Tab key="photos" title="全部">
          {orderList?.map((order: any) => (
            <OrderItem
              key={order.id}
              order={order}
              onPayOrderRedirect={onPayOrderRedirect}
            />
          ))}
        </Tab>

        <Tab key="videos" title="待付款">
          123
        </Tab>
        <Tab key="o" title="已付款">
          123
        </Tab>
      </Tabs>
    </div>
  );
}
