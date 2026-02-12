"use client";
import {
  addToast,
  Button,
  Form,
  Input,
  Image,
  Card,
  CardBody,
  CardFooter,
  Spinner,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { InfiniteScroll } from "antd-mobile";

import { getGoodsId, getGoodsImageId } from "@/services";
import { useGlobalStore } from "@/store";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { useSearchList } from "@/hook/api";
import { CommonTabs } from "@/components/common";

export default function Searchpage() {
  const t = useTranslations("goods.search");
  const { currency } = useGlobalStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const taobaoId = searchParams.get("TAOBAO") as string;
  const alibabaId = searchParams.get("1688") as string;

  const [selectedTab, setSelectedTab] = useState<"TAOBAO" | "1688">("TAOBAO");

  // 根据当前 tab 选择 id
  const currentId = selectedTab === "TAOBAO" ? taobaoId : alibabaId;
  const [uploading, setUploading] = useState(false);

  const {
    data,
    isLoading: loading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useSearchList({
    imageId: currentId,
    source: selectedTab,
    size: 20,
    enabled: !!currentId,
  });

  console.log("data", data);

  const list = data?.pages?.flatMap((page: any) => page.records) ?? [];

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true); // 开始上传
      const res: any = await getGoodsImageId(file);

      if (res && res.length > 0) {
        const taobaoImageId = res.find(
          (item: any) => item.source === "TAOBAO",
        )?.imageId;
        const alibabaImageId = res.find(
          (item: any) => item.source === "1688",
        )?.imageId;

        if (taobaoImageId && alibabaImageId) {
          router.push(
            `/goods/list?TAOBAO=${taobaoImageId}&1688=${alibabaImageId}`,
          );
        }
      }
    } catch (error) {
      console.error("上传图片失败", error);
      addToast({
        title: t("uploadFailed"),
        timeout: 1000,
        color: "danger",
      });
    } finally {
      setUploading(false); // 上传结束
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const triggerUpload = (e: any) => {
    e.stopPropagation(); // 阻止冒泡
    fileInputRef.current?.click();
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    const res: any = await getGoodsId({ url: data.url });

    router.push(
      `/goods/${res.source}/${res.sourceProductId}`, // 目标路由
    );
  };
  const renderSearchContent = () => {
    if (!list?.length && !loading) return <EmptyState />;

    return (
      <>
        {isFetching && <BlockSpinner />}
        <div className="flex-1 overflow-auto">
          {list.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {list.map((item: any) => (
                <Card
                  key={item.sourceProductId}
                  isPressable
                  className="border-1"
                  radius="none"
                  shadow="none"
                  onPress={() =>
                    router.push(`/goods/${item.source}/${item.sourceProductId}`)
                  }
                >
                  <CardBody className="overflow-visible p-0">
                    <Image
                      alt={item.title}
                      className="h-[200px] w-full object-fill"
                      radius="none"
                      src={item.imageUrl}
                      width="100%"
                    />
                  </CardBody>
                  <CardFooter className="text-sm">
                    <div className="text-left">
                      <b className="line-clamp-2">{item.title}</b>
                      <p className="font-semibold text-orange-500">
                        {currency.symbol} {item.price}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <InfiniteScroll
            hasMore={!!hasNextPage}
            loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
          >
            {!hasNextPage && <EmptyState className="!h-auto" />}
          </InfiniteScroll>
        </div>
      </>
    );
  };
  const tabs = [
    {
      key: "TAOBAO",
      title: t("taobao"),
      content: renderSearchContent(),
    },
    {
      key: "1688",
      title: t("1688"),
      content: renderSearchContent(),
    },
  ];

  return (
    <>
      <div className="bg flex items-center justify-between gap-4 p-2 py-4">
        <button onClick={() => router.back()}>
          <IoChevronBack className="h-[25px] w-[25px]" />
        </button>
        <Form className="w-full max-w-xs" onSubmit={onSubmit}>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            endContent={
              <div className="flex items-center gap-2">
                {uploading ? (
                  <Spinner color="primary" size="sm" />
                ) : (
                  <FaRegImage
                    className="cursor-pointer text-xl"
                    onClick={triggerUpload}
                  />
                )}
                <Button
                  isIconOnly
                  className="w-full"
                  color="primary"
                  size="sm"
                  type="submit"
                  variant="light"
                >
                  {t("searchButton")}
                </Button>
              </div>
            }
            labelPlacement="outside"
            name="url"
            placeholder={t("searchPlaceholder")}
            // startContent={
            //   <IoSearch className="pointer-events-none flex-shrink-0 text-lg" />
            // }
            type="search"
          />
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </Form>
        <button
          onClick={() => {
            router.push("/cart");
          }}
        >
          <Image
            alt="cart"
            className="text-black"
            src="/m/images/cart.png"
            width={35}
          />
        </button>
      </div>
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key) => setSelectedTab(key as "TAOBAO" | "1688")}
      />
    </>
  );
}
