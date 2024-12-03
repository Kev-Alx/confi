import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/navbar";
import PreOrderCard from "@/components/preorder/preorder-card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function Home() {
  const preorders = await db.preOrder.findMany({
    where: {
      closeDate: { gt: new Date() },
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="bg-slate-50">
      <Navbar />
      <div className="w-full isolate p-12 relative min-h-[calc(100vh-8rem)] grid place-content-center gap-6">
        <Image
          src={"/Confier-light.svg"}
          alt="confier"
          width={400}
          height={300}
          className="opacity-95 w-full mx-auto max-w-lg"
        />
        <p className="text-white font-medium">
          Titip items from abroad, delivered by travelers you can trust
        </p>
        <Button className="bg-fushia-500 backdrop-blur-md relative">
          <Link href="/search">
            <div className="  w-full h-full absolute inset-0 mix-blend-multiply text-white" />
            <span className="text-white">Start Titip</span>
          </Link>
        </Button>
        <Image
          src={"/hero.png"}
          alt="bgImage"
          fill
          className="absolute inset-0 -z-10"
        />
      </div>
      <main className="px-4 pt-16 max-w-4xl mx-auto">
        <h2 className="font-semibold text-center md:text-start text-xl ">
          Available pre-orders right now
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 ">
          {preorders.map((preorder, i) => (
            <PreOrderCard
              preorder={preorder}
              key={i}
              count={preorder._count.items}
            />
          ))}
        </div>
        <h2 className="font-semibold text-center md:text-start text-xl mt-4">
          Categories
        </h2>
        <div className="grid sm:grid-cols-2 justify-items-center lg:grid-cols-4 gap-6 mt-12 pb-12">
          {["Snacks", "Fashion", "Shoes", "Toys"].map((item, i) => (
            <Link
              href={`/search?c=${item.toUpperCase()}`}
              key={i}
              className="bg-white rounded-md p-2 flex flex-col items-center gap-2"
            >
              <Image
                src={`/c${item.toLowerCase()}.png`}
                alt={item}
                width={120}
                height={120}
              />
              <p className="text-slate-950 font-medium">{item}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
