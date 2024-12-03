import dynamic from "next/dynamic";
import React from "react";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/auth/new-verification-form"),
  { ssr: false }
);

const Page = () => {
  return <DynamicComponentWithNoSSR />;
};

export default Page;
