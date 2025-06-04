"use client";

import {
  addToast,
  Button,
  Checkbox,
  Form,
  Input,
  InputOtp,
} from "@heroui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { IoLockClosed, IoPeopleSharp, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { getcallback, getsignUp } from "@/services/api/auth";

export default function RegisterPage() {
  const [isActive, setIsActive] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [fomeData, setFomeData] = useState<any>();
  const router = useRouter();
  const callback = (e: any) => {
    // console.log(e.length);
    if (e.length === 6) {
      // 激活
      getcallback({ ...fomeData, activationCode: e }).then((e: any) => {
        if (e.success) {
          console.log("注册成功");
          router.push("/dashboard");
        } else {
          addToast({
            title: e.msg,
          });
        }
      });
    }
  };
  const signUp = (e: any) => {
    e.preventDefault();
    if (isCheck) {
      let data: any = Object.fromEntries(new FormData(e.currentTarget));

      console.log(666);

      setFomeData(data);
      console.log("data", data);
      getsignUp({ ...data }).then((e: any) => {
        if (e.success) {
          setIsActive(true);
        } else {
          addToast({
            title: e.msg,
            timeout: 1000,
          });
        }
      });
    } else {
      addToast({
        title: "请勾选统一协议",
      });
    }
  };

  return (
    <div>
      {!isActive ? (
        <>
          <Form className="w-full" onSubmit={signUp}>
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
            />
            <Input
              name="yaoqing"
              placeholder="请输入邀请码，没有邀请码请留空"
              startContent={<IoPeopleSharp />}
            />

            <Checkbox
              checked={isCheck}
              className="my-1 w-full"
              size="sm"
              onChange={() => setIsCheck(!isCheck)}
            >
              I have read and agree to the website terms and conditions
            </Checkbox>
            <Button className="w-full" color="primary" type="submit">
              注册
            </Button>
          </Form>
          <div className="my-4 text-sm">
            <span>Already have an account ? </span>
            <NextLink href="/login">
              <span className="text-[#f0700c]">Go login</span>
            </NextLink>
          </div>
        </>
      ) : (
        <div>
          <p className="text-title-xl">验证你的电子邮箱</p>
          <div className="my-4 text-sm">
            <span>我们已经发送验证码到</span>
            <span className="font-bold">{fomeData.email}</span>
            <span>。请在下面输入验证码进行验证</span>
          </div>
          <InputOtp
            className="m-auto"
            length={6}
            size="lg"
            onValueChange={callback}
          />
          {/* <div className="text-sm">
            <span>没有收到您的电子邮件？</span>
            <span className="font-bold">重新发送验证码</span>
            <span>。请在下面输入验证码进行验证</span>
          </div> */}
        </div>
      )}
    </div>
  );
}
