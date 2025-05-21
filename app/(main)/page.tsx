"use client";
import {
  IoLanguageSharp,
  IoPeopleCircle,
  IoLogoUsd,
  IoSearch,
  IoChevronForwardSharp,
} from "react-icons/io5";
import { Input } from "@heroui/react";
import { Swiper, Image, Avatar } from "antd-mobile";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <section className="p-3">
      <div className="flex justify-between mt-2">
        <div>
          <Logo height={21} width={100} />
        </div>
        <div className="flex  items-center">
          <IoPeopleCircle className="w-[20px] h-[20px] text-[#ea8407]" />
          <IoLanguageSharp className="w-[20px] h-[20px] text-[#ea8407]" />
          <IoLogoUsd className="w-[20px] h-[20px] text-[#ea8407]" />
        </div>
      </div>
      <div className="my-4">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          startContent={<IoSearch />}
          type="search"
        />
      </div>
      <Swiper>
        <Swiper.Item>
          <Image
            className="rounded-lg"
            fit="contain"
            src="https://bbdbuy.com/uploads/20250120/d823737b3074d4992c2a8f4519b2c2d3.png"
          />
        </Swiper.Item>
        <Swiper.Item>
          <Image
            className="rounded-lg"
            fit="contain"
            src="https://bbdbuy.com/uploads/20250120/e4c3fd1baf90e4fae162a1126048f5e0.png"
          />
        </Swiper.Item>
      </Swiper>
      <div className="flex py-3 box-card">
        {siteConfig.toolList.map((item, index) => {
          return (
            <div
              key={item.title}
              className="text-center flex-1 flex justify-center items-center flex-col"
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
        <div className="flex justify-between items-center py-2 px-4">
          <div className="font-bold flex-1 text-sm">Shipping Estimate</div>
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
        <div className="flex justify-between items-center py-2 px-4 pt-0">
          <div className="flex items-center ">
            <div className="w-[6px] h-[6px] rounded-full bg-orange-500 mr-[5px]" />
            <span className="  text-sm ">DHL line fast</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[#f0700c]">71</span>
            <IoChevronForwardSharp />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Image src="https://bbdbuy.com/assets/img/wap/index_bottom.png" />
      </div>
    </section>
  );
}
