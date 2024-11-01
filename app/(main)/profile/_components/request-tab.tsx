import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";
import { addIsJastiper } from "@/lib/utils";

import MyRequestCard from "./my-request-card";

/* eslint-disable @typescript-eslint/no-explicit-any */

const RequestTab = async () => {
  const user = await getCurrentUser();
  const requests = await db.request.findMany({
    where: {
      OR: [{ buyerId: user?.id }, { jastiperId: user?.id }],
    },
    include: {
      Negotiation: {
        include: {
          jastiper: {
            select: {
              name: true,
            },
          },
        },
      },
      item: {
        include: {
          photos: true,
        },
      },
    },
  });
  const reqWithJastiper = addIsJastiper(requests, user?.id || "");

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="w-full bg-slate-50 py-2 text-gray-700 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="jastiper">Jastiper</TabsTrigger>
          <TabsTrigger value="buyer">Titiper</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid px-4 grid-cols-1 sm:grid-cols-2 pt-2 gap-4 ">
            {reqWithJastiper.map((req, i) => (
              <MyRequestCard req={req as any} key={i} />
            ))}
            {requests.length === 0 && (
              <p className="text-muted-foreground col-span-2 mx-auto w-fit">
                No requests found
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="jastiper">
          <div className="grid px-4 sm:grid-cols-2 pt-2 gap-4">
            {reqWithJastiper
              .filter((req) => req.isJastiper === true)
              .map((req, i) => (
                <MyRequestCard req={req as any} key={i} />
              ))}
            {requests.length === 0 && (
              <p className="text-muted-foreground col-span-2 mx-auto w-fit">
                No requests found
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="buyer">
          <div className="grid px-4 sm:grid-cols-2 pt-2 gap-4">
            {reqWithJastiper
              .filter((req) => req.isJastiper === false)
              .map((req, i) => (
                <MyRequestCard req={req as any} key={i} />
              ))}
            {requests.length === 0 && (
              <p className="text-muted-foreground col-span-2 mx-auto w-fit">
                No requests found
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RequestTab;
