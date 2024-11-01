import { useRouter } from "next/navigation";

import { Negotiation } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { acceptNegotiaion, rejectNegotiation } from "@/actions/negotiations";

export const useHandleNegotiation = () => {
  const router = useRouter();
  const { mutate: accept, isPending: isPendingAccept } = useMutation({
    mutationFn: async (nego: Negotiation) => {
      const negotiation = await acceptNegotiaion(nego);

      if (negotiation.status !== 200) {
        return toast.error("Error creating preorder", {
          description: "Negotiation creation failed! Please try again later.",
        });
      }
      toast("Success", {
        description: "Negotiation accepted",
      });
      return router.push(`/request/${nego.requestId}/checkout`);
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const { mutate: reject, isPending: isPendingReject } = useMutation({
    mutationFn: async (negoId: string) => {
      const negotiation = await rejectNegotiation(negoId);

      if (negotiation.status !== 200) {
        return toast.error("Error rejecting negotiation", {
          description: "Negotiation rejection failed! Please try again later.",
        });
      }

      return toast("Success", {
        description: "Negotiation rejected",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return {
    accept,
    isPendingAccept,
    reject,
    isPendingReject,
  };
};
