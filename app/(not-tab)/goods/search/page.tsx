"use client";
import { addToast, Button, Divider, Form, Input } from "@heroui/react";
import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { getGoodsId } from "@/services";
import { SearchIcon } from "@/components/icons";

export default function Searchpage() {
  const router = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));

    let url: URL;

    try {
      url = new URL(data.url);
    } catch (err) {
      // 可选：展示错误提示
      addToast({
        title: "请输入有效的 URL",
        timeout: 1000,
        color: "danger",
      });

      return; // 终止后续逻辑
    }
    const res: any = await getGoodsId({ url });

    router.push(
      `/goods/${res.source}/${res.sourceProductId}`, // 目标路由
    );
    // setIsLoading(true);

    // const data = Object.fromEntries(new FormData(e.currentTarget));
    // const result = await callServer(data);

    // setErrors(result.errors);
    // setIsLoading(false);
  };

  return (
    <div className="bg flex h-[100vh] flex-col">
      <div className="flex items-center justify-between p-4">
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
        </Form>
      </div>
      <div className="flex-1 bg-white p-4">
        <div className="font-bold">历史记录</div>
        <Divider className="my-2" />
        <div className="flex flex-wrap gap-2 p-2">
          <div className="bg-[#f8f8f8] p-2">123</div>
          <div className="bg-[#f8f8f8] p-2">jfaljgf;ljsa;gjs</div>
          <div className="bg-[#f8f8f8] p-2">agsahhdsfhfdh</div>
          <div className="line-clamp-1 overflow-hidden text-ellipsis text-nowrap bg-[#f8f8f8] p-2">
            https://item.taobao.com/item.htm?id=775526482716&pisk=gv1sHpjcscm62vdxld4ePExLblOfHyPr1qTArZhZkCdtDmQJYjzM_-AfcHsDbdROG9cfrZfaSIzMsNADMurzas_GSIX3SsSc1XKpywnvDdee9fwhODEza77QBFAVJu548Y5v7UlvMdpxvwKHlx39WipK9ExK6Eh9kDUBxH39kFht9eLwyndx6fhK9ETrMmpx6BHpxEdvDidYRBKHkbHqPEw6jNagUu6znVE8nhGxM6T6pJ79vmJC9FTMVNCsMjUD5dtRWHZlKv2epZvfiqcXUNBlmUItXotcOwCOegEEQhBWlaWfV7hD-OI19K1Uo77e1E9JMpgxMwO9DL1ww7nB-9QNH1jsljLG__JXqpaxiKRdaLBRfq4lJCLAmLf4qfxOkaflUQNsqF6dPBsyxb-7d4MjRLcXR3zQRxD0fW1R9SuFpQp9-F9URyiOndLHR3zQRxDDBeY6zyaIXtf..&skuId=5475585179011&spm=a21bo.jianhua%2Fa.201876.d2.c2322a89VKbVlR&utparam=%7B%22abid%22%3A%220%22%2C%22x_object_type%22%3A%22p4p_item%22%2C%22pc_pvid%22%3A%2225d49bc7-c318-456c-b91d-24e5a96d601f%22%2C%22mix_group%22%3A%22%22%2C%22pc_scene%22%3A%2220001%22%2C%22aplus_abtest%22%3A%220c5212510237be030a21386b375f12cc%22%2C%22tpp_buckets%22%3A%2230986%23434216%23module%22%2C%22x_object_id%22%3A775526482716%2C%22ab_info%22%3A%2230986%23434216%23-1%23%22%7D&xxc=ad_ct
          </div>
        </div>
      </div>
    </div>
  );
}
