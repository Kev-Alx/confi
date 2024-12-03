import Link from "next/link";
import React from "react";

import { ChevronRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/data/user";
import { FEE_PRICE } from "@/lib/config";
import { db } from "@/lib/db";
import { addDotsToNumber, capitalize } from "@/lib/utils";

import ItemPhotoGallery from "../../../../components/item-photo-gallery";
import ActionButtons from "./action-buttons";

export const dynamic = "force-dynamic";

type Props = {
  params: { requestId: string };
};

const Page = async ({ params }: Props) => {
  const user = await getCurrentUser();
  const req = await db.request.findUnique({
    where: {
      id: params.requestId,
    },
    include: {
      item: {
        include: {
          photos: true,
        },
      },
    },
  });
  const neg = await db.negotiation.findFirst({
    where: {
      requestId: params.requestId,
      jastiperId: user?.id,
    },
  });

  if (!req) {
    return <div>Request not found</div>;
  }
  const isRequester = user?.id === req.buyerId || user?.role === "USER" || neg;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex font-medium items-center gap-2 mb-8">
        <Link href={"/search"}>Request</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">{req.item.name}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="relative">
          <ItemPhotoGallery photos={req.item.photos} />
        </div>
        <div>
          <h1 className="font-semibold text-2xl mb-3">{req.item.name}</h1>
          <p className="text-muted-foreground text-sm mb-9">
            <span className="text-xs">from</span> {req.location}
          </p>
          <p className="font-medium mb-4">{req.item.description}</p>
          {req.item.link && (
            <>
              <p className="max-w-xl overflow-hidden">
                Product link:
                <a href={req.item.link} className="ml-2 text-muted-foreground">
                  {req.item.link}
                </a>
              </p>
            </>
          )}
          <div className="bg-slate-100 px-2 py-1 text-sm rounded-full w-fit text-muted-foreground font-medium mt-2">
            {capitalize(req.item.category)}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Item price</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(req.item.price)} x {req.item.amount}
            </span>
          </div>
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Tips</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(req.item.tips)}
            </span>
          </div>
          <div className="flex justify-between items-center my-4">
            <p className="font-medium">Fee</p>
            <span className="font-semibold">
              Rp, {addDotsToNumber(FEE_PRICE)}
            </span>
          </div>
          {!isRequester && (
            <div className="flex justify-between items-center w-full gap-6 mt-12">
              <ActionButtons fee={req.item.tips} buyerId={req.buyerId} />
            </div>
          )}
          {!!neg && (
            <p className="text-sm text-muted-foreground mt-8">
              You are currently negotiating for this request
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
