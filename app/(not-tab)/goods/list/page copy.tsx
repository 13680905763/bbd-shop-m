"use client";
import {
  Card,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  Image,
  Button,
  Spinner,
  Input,
  Form,
  addToast,
} from "@heroui/react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";

import { SearchIcon } from "@/components/icons";
import { getGoodsList, getGoodsId, getGoodsImageId } from "@/services";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taobaoId = searchParams.get("TAOBAO");
  const alibabaId = searchParams.get("1688");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Tab
  const [selectedTab, setSelectedTab] = useState<"TAOBAO" | "1688">("TAOBAO");

  // 商品列表 & 分页状态
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const currentId = selectedTab === "TAOBAO" ? taobaoId : alibabaId;

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

  // 上传图片
  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const res: any = await getGoodsImageId(file);
      const taobaoImageId = res.find(
        (i: any) => i.source === "TAOBAO",
      )?.imageId;
      const alibabaImageId = res.find((i: any) => i.source === "1688")?.imageId;

      if (taobaoImageId && alibabaImageId) {
        router.push(
          `/goods/list?TAOBAO=${taobaoImageId}&1688=${alibabaImageId}`,
        );
      }
    } catch (err) {
      addToast({ title: "上传失败，请重试", timeout: 1000, color: "danger" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // URL 搜索
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    let url: URL;

    try {
      url = new URL(data.url);
    } catch {
      addToast({ title: "请输入有效的 URL", timeout: 1000, color: "danger" });

      return;
    }
    const res: any = await getGoodsId({ url });

    router.push(`/goods/${res.source}/${res.sourceProductId}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
      {/* 顶部搜索 + 上传 + 返回 + 购物车 */}
      <div className="flex items-center justify-between gap-4 bg-white p-4">
        <button onClick={() => router.back()}>
          <IoChevronBack className="h-[25px] w-[25px]" />
        </button>

        <Form className="max-w-xs flex-1" onSubmit={onSubmit}>
          <Input
            classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
            endContent={
              <div className="flex items-center gap-2">
                <FaRegImage className="text-xl" onClick={triggerUpload} />
                <Button isIconOnly color="primary" size="sm" type="submit">
                  搜索
                </Button>
              </div>
            }
            name="url"
            placeholder="Search..."
            startContent={
              <SearchIcon className="pointer-events-none text-lg" />
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

        <Image alt="cart" src="/m/images/cart.png" width={35} />
      </div>

      {/* Tabs */}
      <Tabs
        classNames={{
          tabList: "flex bg-white",
          tab: "flex-1 text-center py-2",
        }}
        selectedKey={selectedTab}
        variant="underlined"
        onSelectionChange={(key) => setSelectedTab(key as "TAOBAO" | "1688")}
      >
        <Tab key="TAOBAO" title="淘宝" />
        <Tab key="1688" title="1688" />
      </Tabs>

      {/* 商品列表 */}
      <div className="flex-1 overflow-auto p-2">
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
                onPress={() =>
                  router.push(`/goods/${item.source}/${item.sourceProductId}`)
                }
              >
                <CardBody className="p-0">
                  <Image
                    alt={item.title}
                    className="h-32 w-full object-cover"
                    src={item.imageUrl}
                  />
                </CardBody>
                <CardFooter className="text-sm">
                  <div className="line-clamp-2">{item.title}</div>
                  <div className="font-semibold text-orange-500">
                    {item.price}
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
          <div className="py-10 text-center text-gray-500">暂无匹配结果</div>
        )}
      </div>
    </div>
  );
}
