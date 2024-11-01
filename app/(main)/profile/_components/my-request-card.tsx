"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Item, Media, Negotiation, Request } from "@prisma/client";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ChartNoAxesColumnIncreasing,
  Ellipsis,
  ShoppingBagIcon,
  SquareArrowUpRight,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { useHandleNegotiation } from "@/hooks/use-negotiation";
import { useHandleReqiuest } from "@/hooks/use-request";
import { addDotsToNumber, capitalize, cn } from "@/lib/utils";

const MyRequestCard = ({
  req,
}: {
  req: Request & {
    Negotiation: (Negotiation & { jastiper: { name: string } })[];
    item: Item & {
      photos: Media[];
    };
    isJastiper: boolean;
  };
}) => {
  const [open, setOpen] = useState(false);
  const unreadNotif = req.Negotiation.length > 0 && req.status === "WAITING";
  const { accept, reject } = useHandleNegotiation();
  const { deleteRequest, isPendingDelete } = useHandleReqiuest();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this request?",
    "You are about to delete this request. This action is irreversible"
  );

  const hadnleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteRequest(req.id);
  };

  return (
    <div>
      <ConfirmDialog />
      <div className="border relative last:odd:min-w-[60%] border-slate-300 rounded-md px-4 py-2 odd:last:col-span-2 ">
        {unreadNotif && (
          <div className="rounded-full bg-red-500 absolute -top-2 -right-2 h-4 w-4"></div>
        )}
        <div className="flex items-center">
          {req.isJastiper ? (
            <ShoppingBagIcon className="h-7 w-7 mr-3 mt-1 self-start" />
          ) : (
            <SquareArrowUpRight className="h-7 w-7 mr-3 mt-1 self-start" />
          )}
          <div>
            <p className="font-semibold">
              {req.isJastiper ? "Jastiper" : "Titiper"}
            </p>
            <p className="font-medium text-sm">Requested on</p>
            <p className="text-sm">{format(req.createdAt, "dd MMM yyyy")}</p>
          </div>
          <div className="ml-auto items-center flex gap-2">
            <p
              className={cn(
                "font-medium text-sm",
                req.status === "DONE"
                  ? "text-emerald-500"
                  : req.status === "ACCEPTED"
                    ? "text-blue-600"
                    : ""
              )}
            >
              {capitalize(req.status)}
            </p>
            <Dialog>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                  <Ellipsis />
                </PopoverTrigger>
                <PopoverContent className="w-64 flex gap-2 flex-col">
                  {req.status === "WAITING" ? (
                    <DialogTrigger asChild>
                      <Button variant={"ghost"}>
                        <ArrowUpRight />
                        View offers
                      </Button>
                    </DialogTrigger>
                  ) : (
                    <Button variant={"ghost"}>
                      <Link
                        href={`/profile/request/${req.id}`}
                        className="flex items-center gap-2"
                      >
                        <ChartNoAxesColumnIncreasing /> View status
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={hadnleDelete}
                    disabled={isPendingDelete}
                    className="text-red-600"
                    variant={"ghost"}
                  >
                    <TrashIcon />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>

              <DialogContent className="bg-neutral-50">
                <h1 className="font-semibold text-2xl">
                  Jastiper&apos; Offers
                </h1>
                {req.Negotiation.map((neg, i) => (
                  <div
                    className="bg-white p-4 rounded-lg border border-slate-300"
                    key={i}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-xl">{neg.jastiper.name}</p>
                      <p className="font-bold text-xl">
                        Rp, {addDotsToNumber(neg.negotiatedPrice)}
                      </p>
                    </div>
                    <p className="text-sm">{neg.notes}</p>
                    <div className="flex gap-2 items-end">
                      <p className="font-medium mt-8">
                        {format(neg.closeDate, "dd MMMM yyyy")}
                      </p>
                      <Button
                        onClick={() => reject(neg.id)}
                        className="ml-auto"
                        variant={"outline"}
                      >
                        Reject
                      </Button>
                      <Button onClick={() => accept(neg)}>Accept</Button>
                    </div>
                  </div>
                ))}
                {req.Negotiation.length === 0 && (
                  <>
                    <Separator />
                    <p className="text-muted-foreground">No negotiations yet</p>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator className="mt-1" />
        <div className="flex gap-4 mt-2">
          <Image
            src={req.item.photos[0].url}
            alt={req.item.name}
            width={128}
            height={100}
            className="object-cover rounded-md max-h-36 w-auto"
          />
          <div>
            <p className="font-semibold ">{req.item.name}</p>
            <p className="text-muted-foreground">{req.item.amount}x</p>
            <p className="font-semibold">
              Rp, {addDotsToNumber(req.item.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyRequestCard;
