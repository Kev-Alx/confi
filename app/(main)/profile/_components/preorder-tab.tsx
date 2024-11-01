import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";

import MyPreorderCard from "./my-preorder-card";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PreorderTab = async () => {
  const user = await getCurrentUser();
  const pre = await db.preOrder.findMany({
    where: {
      jastiperId: user?.id || "",
    },
    include: {
      items: {
        include: {
          _count: true,
        },
      },
    },
  });
  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full bg-slate-50 py-2 text-gray-700 h-auto">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="ongoing">On going</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div className="grid px-4 grid-cols-1 pt-2 gap-4 ">
          {pre.map((pre, i) => (
            <MyPreorderCard pre={pre as any} key={i} />
          ))}
          {pre.length === 0 && (
            <p className="text-muted-foreground col-span-2 mx-auto w-fit">
              No preorders found
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="ongoing">
        {pre
          .filter((pre) => pre.status !== "DONE")
          .map((pre, i) => (
            <MyPreorderCard pre={pre as any} key={i} />
          ))}
        {pre.filter((pre) => pre.status !== "DONE").length === 0 && (
          <p className="text-muted-foreground col-span-2 mx-auto w-fit">
            No ongoing preorders
          </p>
        )}
      </TabsContent>
      <TabsContent value="done">
        {pre
          .filter((pre) => pre.status === "DONE")
          .map((pre, i) => (
            <MyPreorderCard pre={pre as any} key={i} />
          ))}
        {pre.filter((pre) => pre.status === "DONE").length === 0 && (
          <p className="text-muted-foreground col-span-2 mx-auto w-fit">
            No finished preorders
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PreorderTab;
