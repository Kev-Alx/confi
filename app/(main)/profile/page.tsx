import React from "react";

import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NegotiationTab from "./_components/negotiation-tab";
import PreorderTab from "./_components/preorder-tab";
import RequestTab from "./_components/request-tab";

const Page = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
  return null;
  }

  return (
    <section className="max-w-5xl mx-auto p-4">
      <div className="bg-slate-950 w-full gap-6 py-6 px-4 rounded-lg flex justify-between ">
        <div>
          <h1 className="font-semibold text-2xl text-slate-50">{user.name}</h1>
        </div>
        <div>
          <p className="text-slate-50">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="mt-4 max-w-4xl mx-auto">
        <TabsList className="w-full bg-slate-50 py-2 text-gray-700 h-auto">
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          {user.role === "JASTIPER" && (
            <TabsTrigger value="preorders">My Preorders</TabsTrigger>
          )}
          <TabsTrigger value="negotiations">My Open Negotiations</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <RequestTab />
        </TabsContent>
        {user.role === "JASTIPER" && (
          <TabsContent value="preorders">
            <PreorderTab />
          </TabsContent>
        )}
        <TabsContent value="negotiations">
          <NegotiationTab />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Page;
