"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Item } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { joinPreorder } from "@/actions/preorder";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { addDotsToNumber } from "@/lib/utils";
import { JoinPreorderSchemaType } from "@/schemas/preorder";

type Props = {
  item: Item;
  slot: number;
};

const JoinForm = ({ item, slot }: Props) => {
  const pathname = usePathname();
  const [amt, setAmt] = useState(slot);
  const router = useRouter();
  const { mutate: join, isPending } = useMutation({
    mutationFn: async (val: JoinPreorderSchemaType) => {
      const res = await joinPreorder(val);

      if (res.status !== 200) {
        return toast.error("Order failed! Please try again later.");
      }
    },
    onSuccess: () => {
      router.push(`${pathname}/checkout`);
    },
  });
  const handleJoin = () => {
    if (slot === 0) {
      toast.error("There are no more open slots for this item");
      return;
    }
    join({
      amount: amt,
      itemId: item.id,
    });
  };
  return (
    <div>
      <h1 className="font-semibold text-xl">Order {item.name}</h1>
      <Separator className="my-2" />
      <p className="font-medium">
        There are {slot} slot(s) left open for this item
      </p>
      <p>How many items do you want to order?</p>
      <div className="flex items-center gap-4 my-2">
        <Button
          onClick={() => {
            if (amt <= 1) return;
            setAmt((amt) => amt - 1);
          }}
          size={"icon"}
          className="h-7 w-7"
          disabled={amt <= 1}
          variant={"secondary"}
        >
          <Minus />
        </Button>
        <p className="text-lg font-medium">{"" + amt}</p>
        <Button
          onClick={() => {
            if (amt === slot) return;
            setAmt((amt) => amt + 1);
          }}
          disabled={amt >= slot}
          size={"icon"}
          className="h-7 w-7"
        >
          <Plus />
        </Button>
      </div>
      <p className="flex justify-between items-center font-medium">
        Item price
        <span className="font-bold">
          Rp, {addDotsToNumber(item.price * amt)}
        </span>
      </p>
      <p className="flex justify-between my-2 items-center font-medium">
        Jastiper fee
        <span className="font-bold">
          Rp, {addDotsToNumber(item.tips * amt)}
        </span>
      </p>

      <p className="flex justify-between items-center font-medium">
        Total
        <span className="font-bold">
          Rp, {addDotsToNumber(item.tips * 2 + item.price * amt)}
        </span>
      </p>
      <div className="w-full flex items-center gap-4 mt-8">
        <DialogClose asChild>
          <Button className="w-full" variant={"outline"}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleJoin} disabled={isPending} className="w-full">
          Order
        </Button>
      </div>
    </div>
  );
};

export default JoinForm;
