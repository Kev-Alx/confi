"use client";

import Image from "next/image";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentMethod } from "@/lib/store";

const Page = () => {
  const { setMethod } = usePaymentMethod();

  return (
    <div className="px-6 w-full py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-semibold text-2xl mb-1">Checkout</h1>
        <p className="text-sm text-muted-foreground mb-4">
          This form is just a dummy, there is no need to fill it.
        </p>
        <Label htmlFor="ship">Shipping address</Label>
        <Input id="ship" className="mb-6 mt-3" />
        <Label htmlFor="ship">Payment method</Label>
        <Accordion
          type="single"
          onValueChange={(val: string) => setMethod(val)}
        >
          <AccordionItem value="ShopeePay">
            <AccordionTrigger className="hover:no-underline w-full ">
              <div className="flex items-center justify-start gap-4">
                <Image
                  src={"/shopee.svg"}
                  alt="shopee logo"
                  width={62}
                  height={28}
                />
                <span className="">ShopeePay</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Label
                className="font-normal text-muted-foreground"
                htmlFor="shopee"
              >
                Enter the phone number used to register with ShopeePay
              </Label>
              <Input id="shopee" className="mt-2" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="QRIS">
            <AccordionTrigger className="hover:no-underline flex w-full gap-4">
              <div className="flex items-center justify-start gap-4">
                <Image
                  src={"/qris.svg"}
                  alt="qris logo"
                  width={62}
                  height={28}
                />
                <span className="">QRIS</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Label
                className="font-normal text-muted-foreground"
                htmlFor="shopee"
              >
                Scan the QR code below
              </Label>
              <Image
                src={"/qr.png"}
                alt="qr lentera"
                width={144}
                height={144}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="GoPay">
            <AccordionTrigger className="hover:no-underline flex w-full gap-4">
              <div className="flex items-center justify-start gap-4">
                <Image
                  src={"/gopay.svg"}
                  alt="gopay logo"
                  width={62}
                  height={28}
                />
                <span className="">GoPay</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Label
                className="font-normal text-muted-foreground"
                htmlFor="shopee"
              >
                Enter the phone number used to register with GoPay
              </Label>
              <Input id="shopee" className="mt-2" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
