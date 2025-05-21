"use client";

import { Button, Form, Input } from "@heroui/react";
import React from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import NextLink from "next/link";

export default function LoginPage() {
  return (
    <div>
      <Form className="w-full ">
        <Input
          size="lg"
          //   isRequired
          //   errorMessage="Please enter a valid email"
          name="email"
          //   labelPlacement="outside"
          placeholder="Enter your email"
          //   type="email"
          startContent={<IoPerson />}
        />
        <Input
          name="email"
          placeholder="Password"
          size="lg"
          startContent={<IoLockClosed />}
        />

        <div className="my-2" />
        <Button
          className="w-full"
          size="lg"
          color="primary"
          //   type="submit"
        >
          Submit
        </Button>
        <NextLink className="w-full" href="/register">
          <Button
            className="w-full button-default"
            size="lg"
            color="primary"
            //   type="submit"
          >
            注册
          </Button>
        </NextLink>
      </Form>
    </div>
  );
}
