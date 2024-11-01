import Link from "next/link";
import React from "react";

import { Item, Media } from "@prisma/client";
import { ChevronRight } from "lucide-react";

import ItemPhotoGallery from "@/components/item-photo-gallery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/data/user";
import { FEE_PRICE } from "@/lib/config";
import { db } from "@/lib/db";
import { addDotsToNumber, capitalize } from "@/lib/utils";

import JoinForm from "../join-form";

type Props = {
  params: { preorderId: string; itemId: string };
};

const Page = async ({ params }: Props) => {
  const user = await getCurrentUser();
  const pre = await db.preOrder.findUnique({
    where: {
      id: params.preorderId,
    },
    include: {
      items: {
        where: {
          id: params.itemId,
        },
        include: {
          photos: true,
        },
      },
    },
  });
  const isOwner = user?.id === pre?.jastiperId;
  const joinAmts = await db.preorderJoins.findMany({
    where: {
      itemId: params.itemId,
    },
    select: {
      amount: true,
    },
  });
  const openSlots =
    (pre?.items[0].amount || 0) - joinAmts.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex font-medium items-center gap-2 mb-8">
        <Link href={"/search?type=preorder"}>Preorder</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/preorder/${params.preorderId}`}>{pre?.title}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">{pre?.items[0].name}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="relative">
          <ItemPhotoGallery photos={pre?.items[0].photos as Media[]} />
        </div>
        <div>
          <h1 className="font-semibold text-2xl mb-3">{pre?.items[0].name}</h1>
          <p className="text-muted-foreground text-sm mb-9">
            <span className="text-xs">from</span> {pre?.location}
          </p>
          <p className="font-medium mb-4">{pre?.items[0].description}</p>
          {pre?.items[0].link && (
            <>
              <p>
                Product link:
                <span className="ml-2 text-muted-foreground">
                  {pre?.items[0].link}
                </span>
              </p>
            </>
          )}
          <div className="bg-slate-100 px-2 py-1 text-sm rounded-full w-fit text-muted-foreground font-medium mt-2">
            {capitalize(pre?.items[0].category as string)}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Item price</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(pre?.items[0].price as number)}
            </span>
          </div>
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Tips</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(pre?.items[0].tips as number)}
            </span>
          </div>
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Fee</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(FEE_PRICE)}
            </span>
          </div>
          {!isOwner && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Order</Button>
              </DialogTrigger>
              <DialogContent>
                <JoinForm item={pre?.items[0] as Item} slot={openSlots} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
