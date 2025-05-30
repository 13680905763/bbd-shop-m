"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Form,
  Input,
} from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";
const countrys = [
  {
    label: "中国银行",
    key: "Argentina",
    // src: "https://flagcdn.com/ar.svg",
  },
  {
    label: "建设银行",
    key: "Venezuela",
    // src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "paypal",
    key: "Brazil",
    // src: "https://flagcdn.com/ve.svg",
  },
];

export default function Settingpage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        提现
      </NavBar>
      <div className="px-2">
        <div className="text-center box-card p-2">
          <div className="text-[24px] font-bold text-[#f3643a] my-[10px]">
            CAD 0.00
          </div>
          <div className="text-sm text-[#999]">总余额</div>
        </div>
        <div className="box-card p-4">提现服务费率：1%</div>
        <div>
          <Form
            className="w-full  flex flex-col gap-2 p-4 rounded-lg bg-white"
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
              name="username"
              placeholder="收款人"
              type="text"
              variant="bordered"
            />

            <Autocomplete
              defaultItems={countrys}
              name="country"
              placeholder="国家"
              variant="bordered"
            >
              {(country: any) => (
                <AutocompleteItem
                  key={country.key}
                  startContent={
                    <Avatar
                      alt="Argentina"
                      className="w-6 h-6"
                      src={country.src}
                    />
                  }
                >
                  {country.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              classNames={{
                inputWrapper: "data-[focus=true]:!border-[#f0700c]",
              }}
              name="email2"
              placeholder="银行卡"
              type="number"
              // value={user.phone}
              variant="bordered"
            />
            <Input
              classNames={{
                inputWrapper: "data-[focus=true]:!border-[#f0700c]",
              }}
              name="email1"
              placeholder="提现金额"
              type="number"
              // value={user.phone}
              variant="bordered"
            />
            <Button className="w-full mt-2" color="primary" type="submit">
              提现
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
