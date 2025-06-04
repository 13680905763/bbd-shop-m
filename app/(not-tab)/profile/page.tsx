"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
} from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/services/hooks/useUser";
const countrys = [
  {
    label: "Argentina",
    key: "Argentina",
    src: "https://flagcdn.com/ar.svg",
  },
  {
    label: "Venezuela",
    key: "Venezuela",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "Brazil",
    key: "Brazil",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "Switzerland",
    key: "Switzerland",
    src: "https://flagcdn.com/ch.svg",
  },
];

export default function Settingpage() {
  const { user, isLoading, isError } = useUser();
  const router = useRouter();

  console.log("user", user);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        个人信息
      </NavBar>
      <div className="px-2">
        <div className="box-card flex flex-col items-center justify-center p-2">
          <Avatar className="h-[80px] w-[80px]" src={user.avatarUrl} />
          <div className="text-lg font-bold">{user.name}</div>
        </div>
        <div className="">
          <Form
            className="flex w-full flex-col gap-2"
            // onReset={() => setAction("reset")}
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget));
            }}
          >
            <Input
              isRequired
              classNames={{
                inputWrapper: "data-[focus=true]:!border-[#f0700c]",
              }}
              errorMessage="Please enter a valid username"
              label="用户名"
              name="username"
              placeholder="Enter your username"
              size="sm"
              type="text"
              value={user.name}
              variant="bordered"
            />
            <Input
              classNames={{
                inputWrapper: "data-[focus=true]:!border-[#f0700c]",
              }}
              label="电话"
              name="email"
              placeholder="Enter your phone"
              size="sm"
              type="number"
              value={user.phone}
              variant="bordered"
            />
            <DatePicker
              classNames={{
                inputWrapper: "focus-within:!border-[#f0700c]",
              }}
              size="sm"
              label="生日"
              // value={user.createTime}
              variant="bordered"
            />
            <Autocomplete
              defaultItems={countrys}
              label="国家"
              name="country"
              size="sm"
              variant="bordered"
            >
              {(country) => (
                <AutocompleteItem
                  key={country.key}
                  startContent={
                    <Avatar
                      alt="Argentina"
                      className="h-6 w-6"
                      src={country.src}
                    />
                  }
                >
                  {country.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Button className="mt-2 w-full" color="primary" type="submit">
              修改
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
