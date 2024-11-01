"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Category, Item } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTotalSum } from "@/lib/store";
import { addDotsToNumber } from "@/lib/utils";

type Props = {
  item: Item;
};

const noOriCheckCategories: Category[] = ["TOYS", "SKINCARE", "SNACKS"];

const SummaryBar = ({ item }: Props) => {
  const pathname = usePathname();
  const isConfirming = pathname.endsWith("/pay");
  const { setSum } = useTotalSum();

  useEffect(() => {
    setSum(
      item.price +
        5000 +
        item.tips +
        (!noOriCheckCategories.includes(item.category) ? 40000 : 0)
    );
  }, [setSum, item.price, item.tips, item.category]);

  return (
    <div className="bg-slate-100 min-w-80 w-full md:max-w-md ml-auto lg:px-8 py-6 px-4 h-full space-y-4">
      <h1 className="font-bold text-2xl">Summary</h1>
      <p className="font-medium flex justify-between">
        Item price <span>Rp. {addDotsToNumber(item.price)}</span>
      </p>
      <p className="font-medium flex justify-between">
        Jastiper Fee <span>Rp. {addDotsToNumber(item.tips)}</span>
      </p>
      <p className="font-medium flex justify-between">
        Fee <span>Rp. {addDotsToNumber(5000)}</span>
      </p>
      {!noOriCheckCategories.includes(item.category) && (
        <p className="font-medium flex justify-between">
          Originality check
          <span>Rp. {addDotsToNumber(40000)}</span>
        </p>
      )}
      <Separator />
      <p className="font-medium flex justify-between">
        Total
        <span>
          Rp,{" "}
          {addDotsToNumber(
            item.price +
              5000 +
              item.tips +
              (!noOriCheckCategories.includes(item.category) ? 40000 : 0)
          )}
        </span>
      </p>
      <p className="text-muted-foreground text-sm">
        Since this is a prototype, all payments are mocked. You won&apos;t be
        charged. Your order will still be marked as accepted.
      </p>
      {!isConfirming && (
        <Button className="w-full" asChild>
          <Link href={`${pathname}/pay`}>Proceed</Link>
        </Button>
      )}
    </div>
  );
};

export default SummaryBar;
