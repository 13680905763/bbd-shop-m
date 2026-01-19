"use client";
import {
  IoLanguageSharp,
  IoLogoUsd,
  IoSearch,
  IoChevronForwardSharp,
} from "react-icons/io5";
import { Button, Input, Avatar } from "@heroui/react";
import { Swiper, Image } from "antd-mobile";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/icons";

export default function Home() {
  const t = useTranslations("home");
  const router = useRouter();
  const toolTab = [
    {
      image: "/m/images/home/tab1.png",
      href: "https://discord.gg/N34Q27Vts8",
    },
    {
      image: "/m/images/home/tab2.png",
      href: "/dashboard",
    },
    {
      image: "/m/images/home/tab3.png",
      href: "/estimation",
    },
    {
      image: "/m/images/home/tab4.png",
      href: "/register",
    },
  ];
  const toolList = [
    {
      image: "/m/images/home/Guide.png",
      title: t("toolList.guide"),
      to: "/help/guide",
    },
    {
      image: "/m/images/home/Community.png",
      title: "Telegram",
      to: "https://t.me/bbdbuyofficial",
    },
    {
      image: "/m/images/home/Forwarding.png",
      title: t("toolList.forwarding"),
      to: "/forwarding",
    },
    {
      image: "/m/images/home/FillBuy.png",
      title: t("toolList.fillBuy"),
    },
  ];

  return (
    <>
      <div className="mt-2 space-y-2 p-3">
        <div className="flex justify-between">
          <Logo height={21} width={100} />
          <div className="flex items-center">
            <IoLanguageSharp
              className="h-[20px] w-[20px] text-[#ea8407]"
              onClick={() => router.push("/setting/language")}
            />
            <IoLogoUsd
              className="h-[20px] w-[20px] text-[#ea8407]"
              onClick={() => router.push("/setting/currency")}
            />
          </div>
        </div>
        <Button
          className="w-full justify-between bg-white px-2"
          endContent={<FaRegImage className="text-xl" />}
          radius="sm"
          startContent={
            <div className="flex items-center gap-2 bg-white">
              <IoSearch className="text-xl" />
              {t("search.placeholder")}
            </div>
          }
          onPress={() => router.push("/goods/search")}
        />
      </div>
      <div className="flex-1 space-y-2 overflow-auto p-3 pt-0 scrollbar-hide">
        <Swiper>
          <Swiper.Item>
            <Image
              className="rounded-lg"
              fit="contain"
              src="/m/images/home/Swiper.png"
            />
          </Swiper.Item>
        </Swiper>
        <div className="home-card grid grid-cols-4">
          {toolList.map((item) => {
            return (
              <button
                key={item.title}
                onClick={() => router.push(item?.to || "")}
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar radius="md" src={item.image} />
                  <span>{item.title}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div
          className="home-card space-y-2 px-4"
          role="button"
          onClick={() => router.push("/estimation")}
        >
          <div className="flex justify-between">
            <div className="flex-1 text-sm font-bold">
              {t("shipping.title")}
            </div>
            <div className="flex-1">
              <Input
                readOnly
                aria-label="Search"
                classNames={{
                  inputWrapper: "bg-[#f7f8f9]",
                }}
                endContent={<IoSearch className="text-[#f0700c]" />}
                labelPlacement="outside"
                placeholder={t("shipping.placeholder")}
                size="sm"
                type="search"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="mr-[5px] h-[6px] w-[6px] rounded-full bg-orange-500" />
              <span className="font-semibold">{t("shipping.lineFast")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#f0700c]">71</span>
              <IoChevronForwardSharp />
            </div>
          </div>
        </div>
        <Image className="rounded-lg" src={"/m/images/home/footer.jpg"} />
        <div className="grid grid-cols-2 gap-2">
          {toolTab.map((item) => {
            return (
              <Image
                key={item.href}
                className="w-full rounded-lg"
                height={95}
                src={item.image}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
