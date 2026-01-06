"use client";
import {
  addToast,
  Button,
  Form,
  Input,
  Image,
  Tabs,
  Tab,
  Spinner,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { FaRegImage } from "react-icons/fa";

import { getGoodsId, getGoodsImageId, getGoodsList } from "@/services";
import { SearchIcon } from "@/components/icons";

export default function Searchpage() {
  const t = useTranslations("goods.search");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const taobaoId = searchParams.get("TAOBAO") as string;
  const alibabaId = searchParams.get("1688") as string;

  const [selectedTab, setSelectedTab] = useState<"TAOBAO" | "1688">("TAOBAO");

  // 根据当前 tab 选择 id
  const currentId = selectedTab === "TAOBAO" ? taobaoId : alibabaId;
  const [uploading, setUploading] = useState(false);
  // 商品列表 & 分页状态
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const fetchData = useCallback(
    async (pageNum: number) => {
      if (!currentId) return;

      try {
        setLoading(true);
        const res: any = await getGoodsList({
          imageId: currentId,
          source: selectedTab,
          current: pageNum,
          size: 20,
        });

        if (!res || res.length === 0) {
          setHasMore(false);

          return;
        }

        if (res.length < 20) setHasMore(false);

        setList((prev) => (pageNum === 1 ? res : [...prev, ...res]));
      } catch (err) {
        console.error("搜索失败:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentId, selectedTab],
  );

  // 切换 Tab 或 URL 参数变化时重置列表
  useEffect(() => {
    setList([]);
    setPage(1);
    setHasMore(true);

    if (currentId) fetchData(1);
  }, [currentId, fetchData]);
  // 翻页加载
  useEffect(() => {
    if (page === 1) return;
    fetchData(page);
  }, [page, fetchData]);
  // 滚动加载更多
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);
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

  return (
    <div className="bg flex h-[100vh] flex-col">
      <div className="flex items-center justify-between gap-4 p-4">
        <button onClick={() => router.back()}>
          <IoChevronBack className="h-[25px] w-[25px]" />
        </button>
        <Form className="w-full max-w-xs" onSubmit={onSubmit}>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-default-100",
              input: "text-sm",
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
            startContent={
              <SearchIcon className="pointer-events-none flex-shrink-0 text-lg" />
            }
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
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-4 pt-0">
        {/* Tabs */}
        <Tabs
          classNames={{
            tabList: "flex bg-white",
            tab: "flex-1 text-center py-2 ",
            cursor: "w-full bg-[#f0700c]",
            tabContent: "group-data-[selected=true]:text-[#f0700c]",
          }}
          selectedKey={selectedTab}
          size="lg"
          variant="underlined"
          onSelectionChange={(key) => setSelectedTab(key as "TAOBAO" | "1688")}
        >
          <Tab key="TAOBAO" title={t("taobao")} />
          <Tab key="1688" title={t("1688")} />
        </Tabs>
        {/* 商品列表 */}
        <div className="flex-1 overflow-auto">
          {loading && list.length === 0 && (
            <div className="flex h-[50vh] items-center justify-center">
              <Spinner color="primary" size="lg" />
            </div>
          )}

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
                        {item.price}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {loading && hasMore && list.length > 0 && (
            <div className="flex justify-center py-4">
              <Spinner color="primary" size="lg" />
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="py-10 text-center text-gray-500">{t("noResult")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
