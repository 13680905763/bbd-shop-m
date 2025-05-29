"use client";

import { addToast, Button, Form, Input } from "@heroui/react";
import React from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { getlogin } from "@/services/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const onSubmit = (e: any) => {
    e.preventDefault();
    let data: any = Object.fromEntries(new FormData(e.currentTarget));

    console.log("data", data);
    getlogin({ ...data }).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
          color: "success",
        });
        router.push("/m");
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
          color: "danger",
        });
      }
    });
  };

  return (
    <div>
      <Form className="w-full" onSubmit={onSubmit}>
        <Input
          isRequired
          errorMessage="Please enter a valid email"
          name="email"
          placeholder="Enter your email"
          startContent={<IoPerson />}
          type="email"
        />
        <Input
          name="password"
          placeholder="Password"
          startContent={<IoLockClosed />}
          type="password"
        />

        <div className="my-2" />
        <Button className="w-full" color="primary" type="submit">
          登录
        </Button>
        <NextLink className="w-full" href="/m/register">
          <Button className="w-full button-default">注册</Button>
        </NextLink>
      </Form>
    </div>
  );
}
