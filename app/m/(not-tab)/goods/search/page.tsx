"use client";
import { Button, Divider, Form, Input } from "@heroui/react";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { SearchIcon } from "@/components/icons";

export default function Searchpage() {
  const router = useRouter();

  /**
   * 从 1688 商品链接中提取 offerId
   * @param url 商品详情页链接
   * @returns 提取到的 offerId 或 null
   */
  function extractOfferId(parsedUrl: any): string | null {
    try {
      const pathname = parsedUrl.pathname;

      // 匹配 /offer/865930740519.html 中的 ID
      const match = pathname.match(/\/offer\/(\d+)\.html/);

      return match ? match[1] : null;
    } catch (err) {
      console.error("无效的 URL:", err);

      return null;
    }
  }
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    const url = new URL(data.url);

    console.log(url);
    const source =
      data.url.includes("item.taobao.com") ||
      data.url.includes("detail.tmall.com")
        ? "TAOBAO"
        : data.url.includes("detail.1688.com/")
          ? "1688"
          : "weidian";
    const sourceproductId = url.searchParams.get("id") || extractOfferId(url);

    console.log(source, sourceproductId);

    //  source: "TAOBAO",
    //     sourceproductId: "788110260427",
    router.push(
      `/m/goods/${source}/${sourceproductId}` // 目标路由
    );

    // setIsLoading(true);

    // const data = Object.fromEntries(new FormData(e.currentTarget));
    // const result = await callServer(data);

    // setErrors(result.errors);
    // setIsLoading(false);
  };

  return (
    <div className="h-[100vh] flex  flex-col bg">
      <div className="flex p-4 items-center justify-between">
        <button onClick={() => router.back()}>
          <IoChevronBack className="w-[25px] h-[25px]" />
        </button>
        <Form className="w-full max-w-xs" onSubmit={onSubmit}>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-default-100",
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
              <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
          />
        </Form>
      </div>
      <div className="flex-1 bg-white p-4">
        <div className="font-bold">历史记录</div>
        <Divider className="my-2" />
        <div className="p-2 flex flex-wrap gap-2">
          <div className="p-2 bg-[#f8f8f8]">123</div>
          <div className="p-2 bg-[#f8f8f8]">jfaljgf;ljsa;gjs</div>
          <div className="p-2 bg-[#f8f8f8]">agsahhdsfhfdh</div>
          <div className="p-2 bg-[#f8f8f8] line-clamp-1 overflow-hidden text-nowrap text-ellipsis">
            https://item.taobao.com/item.htm?id=775526482716&pisk=gv1sHpjcscm62vdxld4ePExLblOfHyPr1qTArZhZkCdtDmQJYjzM_-AfcHsDbdROG9cfrZfaSIzMsNADMurzas_GSIX3SsSc1XKpywnvDdee9fwhODEza77QBFAVJu548Y5v7UlvMdpxvwKHlx39WipK9ExK6Eh9kDUBxH39kFht9eLwyndx6fhK9ETrMmpx6BHpxEdvDidYRBKHkbHqPEw6jNagUu6znVE8nhGxM6T6pJ79vmJC9FTMVNCsMjUD5dtRWHZlKv2epZvfiqcXUNBlmUItXotcOwCOegEEQhBWlaWfV7hD-OI19K1Uo77e1E9JMpgxMwO9DL1ww7nB-9QNH1jsljLG__JXqpaxiKRdaLBRfq4lJCLAmLf4qfxOkaflUQNsqF6dPBsyxb-7d4MjRLcXR3zQRxD0fW1R9SuFpQp9-F9URyiOndLHR3zQRxDDBeY6zyaIXtf..&skuId=5475585179011&spm=a21bo.jianhua%2Fa.201876.d2.c2322a89VKbVlR&utparam=%7B%22abid%22%3A%220%22%2C%22x_object_type%22%3A%22p4p_item%22%2C%22pc_pvid%22%3A%2225d49bc7-c318-456c-b91d-24e5a96d601f%22%2C%22mix_group%22%3A%22%22%2C%22pc_scene%22%3A%2220001%22%2C%22aplus_abtest%22%3A%220c5212510237be030a21386b375f12cc%22%2C%22tpp_buckets%22%3A%2230986%23434216%23module%22%2C%22x_object_id%22%3A775526482716%2C%22ab_info%22%3A%2230986%23434216%23-1%23%22%7D&xxc=ad_ct
          </div>
        </div>
      </div>
    </div>
  );
}
