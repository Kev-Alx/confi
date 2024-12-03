import NegotiationCard from "@/app/(main)/profile/_components/negotiation-card";
import { getCurrentUser } from "@/data/user";
import { db } from "@/lib/db";

const NegotiationTab = async () => {
  const user = await getCurrentUser();
  const negotiations = await db.negotiation.findMany({
    where: {
      jastiperId: user?.id,
    },
    include: {
      request: {
        include: {
          item: true,
        },
      },
    },
  });
  return (
    <div className="px-4 flex flex-col gap-4">
      {negotiations.map((nego, i) => (
        <NegotiationCard nego={nego} key={"nego" + i} />
      ))}
      {negotiations.length === 0 && (
        <p className="text-muted-foreground mx-auto w-fit">
          No negotiations found
        </p>
      )}
    </div>
  );
};

export default NegotiationTab;
