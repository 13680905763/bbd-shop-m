"use client";

import { Button, Checkbox, Form, Input } from "@heroui/react";
import React from "react";
import { IoLockClosed, IoPeopleSharp, IoPerson } from "react-icons/io5";
import NextLink from "next/link";

export default function RegisterPage() {
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
        <Input
          name="email"
          placeholder="Password"
          size="lg"
          startContent={<IoPeopleSharp />}
        />
        <Checkbox className="my-4" size="sm">
          I have read and agree to the website terms and conditions
        </Checkbox>
        <Button
          className="w-full"
          size="lg"
          color="primary"
          //   type="submit"
        >
          Submit
        </Button>
      </Form>
      <div className="text-sm my-4">
        <span>Already have an account ? </span>
        <NextLink href="/login">
          <span className="text-[#f0700c]">Go login</span>
        </NextLink>
      </div>
    </div>
  );
}
