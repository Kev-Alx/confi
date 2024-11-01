"use client";

import React from "react";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import { DEFAULT_LOGIN_REDIRECT } from "@/route";

import { Button } from "../ui/button";

const Social = () => {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
        <span className="ml-2">Continue with google</span>
      </Button>
    </div>
  );
};

export default Social;
