"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { usePaymentMethod, useTotalSum } from "@/lib/store";
import { addDotsToNumber } from "@/lib/utils";

const Page = () => {
  const { payment } = usePaymentMethod();
  const [time, setTime] = useState(8);
  const [timePay, setTimePay] = useState(60);
  const { sum } = useTotalSum();
  const router = useRouter();
  useEffect(() => {
    const int = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const payWithin = setInterval(() => {
      setTimePay((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(payWithin);
  }, []);

  useEffect(() => {
    if (time === 0) {
      setTime(0);
      router.replace(`/success`);
    }
  }, [time, router]);

  return (
    <div className="px-6 w-full py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-semibold text-2xl mb-1">Payment</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This checkout page is a mock. There is no need to pay, you will be
          redirected in {time}s.
        </p>
        <div className="space-y-4">
          <p className="w-full font-medium flex justify-between">
            Total payment <span>Rp, {addDotsToNumber(sum)}</span>
          </p>
          <Separator />
          <p className="w-full font-medium flex justify-between">
            Pay within <span>4m {timePay}s</span>
          </p>
          <Separator />
          <p className="w-full font-medium flex justify-between">
            {payment} <span>0811 1111 1111</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
