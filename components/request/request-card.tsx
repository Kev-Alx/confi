import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Item } from "@prisma/client";

import { addDotsToNumber, cn } from "@/lib/utils";

type Props = {
  item: Item & { photos: { url: string }[] };
  location?: string;
  reqId?: string;
  className?: string;
};

const RequestCard = ({ item, location, reqId, className }: Props) => {
  return (
    <Link
      href={reqId ? reqId : "#"}
      className={cn(
        "hover:bg-slate-50 inline-block cursor-pointer p-2",
        className
      )}
    >
      <Image
        alt="Item photo"
        src={item.photos[0].url}
        className="object-cover rounded-md max-h-64"
        width={300}
        height={200}
      />
      <div>
        {location ? (
          <p className="text-xs text-muted-foreground mt-4">
            from <span className="text-sm">{location}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-4">
            Open for {item.amount} items
          </p>
        )}
        <p className="font-medium mt-2 text-black">{item.name}</p>
        <p className="font-bold text-lg text-black">
          Rp, {addDotsToNumber(item.price)}
        </p>
      </div>
    </Link>
  );
};

export default RequestCard;
