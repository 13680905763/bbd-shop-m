"use client";
import {
  IoLanguageSharp,
  IoPeopleCircle,
  IoLogoUsd,
  IoSearch,
  IoChevronForwardSharp,
} from "react-icons/io5";
import { Button, Input } from "@heroui/react";
import { Swiper, Image, Avatar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export default function Home() {
  const router = useRouter();

  return (
    <section className="hide-scrollbar flex flex-1 flex-col overflow-auto p-3 pb-0">
      <div>
        <div className="mt-2 flex justify-between">
          <div>
            <Logo height={21} width={100} />
          </div>
          <div className="flex items-center">
            <IoPeopleCircle className="h-[20px] w-[20px] text-[#ea8407]" />
            <IoLanguageSharp className="h-[20px] w-[20px] text-[#ea8407]" />
            <IoLogoUsd className="h-[20px] w-[20px] text-[#ea8407]" />
          </div>
        </div>
        <div className="my-4">
          {/* <NextLink href="/m/goods/search"> */}
          <Button
            className="w-full justify-start bg-white"
            size="sm"
            startContent={
              <div className="flex items-center gap-2 bg-white text-sm">
                <IoSearch />
                Search...
              </div>
            }
            onPress={() => router.push("/goods/search")}
          />

          {/* </NextLink> */}
        </div>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <Swiper>
          <Swiper.Item>
            <Image
              // height={10}
              className="rounded-lg"
              fit="contain"
              src="/m/images/home/Swiper.png"
            />
          </Swiper.Item>
          {/* <Swiper.Item>
            <Image
              className="rounded-lg"
              fit="contain"
              src="https://bbdbuy.com/uploads/20250120/e4c3fd1baf90e4fae162a1126048f5e0.png"
            />
          </Swiper.Item> */}
        </Swiper>
        <div className="box-card flex py-3">
          {siteConfig.toolList.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-1 flex-col items-center justify-center text-center"
              >
                <div>
                  <Avatar src={item.image} />
                </div>
                <p className="mt-3">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div className="box-card py-2">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex-1 text-sm font-bold">Shipping Estimate</div>
            <div className="flex-1">
              <Input
                aria-label="Search"
                classNames={{
                  inputWrapper: "bg-[#f7f8f9]",
                  input: "text-sm",
                }}
                endContent={<IoSearch className="text-[#f0700c]" />}
                labelPlacement="outside"
                placeholder="France /1000g /1..."
                size="sm"
                type="search"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 pt-0">
            <div className="flex items-center">
              <div className="mr-[5px] h-[6px] w-[6px] rounded-full bg-orange-500" />
              <span className="text-sm">DHL line fast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#f0700c]">71</span>
              <IoChevronForwardSharp />
            </div>
          </div>
        </div>
        <Image
          className="mt-5 h-auto w-full rounded-lg object-cover"
          src={"/m/images/home/footer.jpg"}
        />
        <div className="my-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {siteConfig.toolTab.map((item) => {
            return (
              <Image
                key={item.title}
                className="h-auto w-full rounded-lg object-cover"
                height={100}
                src={item.image}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
