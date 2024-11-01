"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { Loader2Icon } from "lucide-react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/search");
    }, 3000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main className="w-full h-screen grid place-items-center">
      <div className="flex flex-col gap-4 items-center">
        <Image src={"/Confier.svg"} alt="logo" width={200} height={200} />
        <Image
          src={"/success-payment.svg"}
          alt="success"
          width={200}
          height={200}
        />
        <h1 className="font-bold text-2xl">Payment Success!</h1>
        <p className="flex items-center gap-2">
          Redirecting you back...{" "}
          <Loader2Icon className="animate-spin h-5 w-5" />
        </p>
      </div>
    </main>
  );
};

export default Page;
