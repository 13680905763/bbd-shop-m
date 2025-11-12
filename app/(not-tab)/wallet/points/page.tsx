"use client";
import { Tab, Tabs } from "@heroui/react";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoWallet } from "react-icons/io5";

import { usePointsList } from "@/hook/wallet/usePointsList";
import { getUserInfo } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Settingpage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = usePointsList();
  const pointsList = data?.pages?.flatMap((page: any) => page?.records) ?? [];
  // 获取用户信息
  const fetchUser = async () => {
    try {
      const res = await getUserInfo();

      setUser(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <FullscreenLoader />;

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        积分
      </NavBar>

      <div className="p-2">
        <div className="flex rounded-lg bg-[#ffeee1] p-6">
          <div className="flex flex-1 items-center gap-2">
            <IoWallet className="h-5 w-5 text-[#f0700c]" />
            <div>积分</div>
            <div className="flex items-center gap-2">
              <span className="text-money-3xl">{user?.myPoints}</span>
            </div>
          </div>
        </div>

        <div>
          <Tabs
            aria-label="Options"
            classNames={{
              base: "mt-2 w-full bg-white p-1",
              tabList: "gap-6 w-full relative rounded-none p-0 justify-center",

              cursor: "w-full bg-[#f0700c] ",
              tab: " px-0 h-12 flex-1",
              tabContent: "group-data-[selected=true]:text-[#f0700c]",
            }}
            variant="underlined"
          >
            <Tab key="photos" title="积分详情">
              {pointsList.map((record: any) => (
                <div
                  key={record?.id}
                  className="box-card !my-0 flex items-center justify-between p-4"
                >
                  <div>
                    <p>{record?.bizType}</p>
                    <p>{record?.createTime}</p>
                  </div>
                  <div className="text-money-xl">{record?.amount}</div>
                </div>
              ))}
              <InfiniteScroll
                hasMore={!!hasNextPage}
                loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
              />
            </Tab>

            <Tab key="videos" title="积分兑换">
              {/* <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-white p-5">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      size="lg"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className="text-money-xl">CAD 999</div>
                    <div className="text-xs">
                      <div>所需积分：50</div>
                      <div>需要会员等级：1</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button color="primary">兑换</Button>
                </div>
              </div> */}
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
