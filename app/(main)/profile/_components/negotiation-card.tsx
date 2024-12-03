"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { cancelNegotiation } from "@/actions/negotiations";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { addDotsToNumber } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  nego: any;
};

const NegotiationCard = ({ nego }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Cancel this negotiation?",
    "You are about to cancel this negotiation. This action is irreversible"
  );
  const router = useRouter();
  const { mutate: cancel, isPending } = useMutation({
    mutationFn: async (values: string) => {
      const request = await cancelNegotiation(values);

      if (request.status !== 200) {
        return toast.error("Error canceling negotiation", {
          description:
            "Negotitaion cancellation failed! Please try again later.",
        });
      }
      return toast("Success", {
        description: "Negotiation canceled",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    cancel(nego.id);
  };

  return (
    <>
      <ConfirmDialog />
      <div
        className="bg-slate-50 border rounded-md border-slate-300 p-4
      "
      >
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-2xl">{nego.request.item.name}</h1>
          <p className="flex gap-1 items-center font-bold text-xl">
            Rp,{" "}
            <span className="w-max">
              {addDotsToNumber(nego.request.item.tips)}
            </span>
            {nego.negotiatedPrice !== nego.request.item.tips && (
              <>
                <ArrowRight className="h-5 w-5" />{" "}
                {addDotsToNumber(nego.negotiatedPrice)}
              </>
            )}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          from <span className="text-sm">{nego.request.location}</span>
        </p>

        <div className="flex justify-between items-center">
          <p className="font-medium mt-5">
            Closes at {format(new Date(nego.closeDate), "dd MMMM yyyy")}
          </p>
          <Button disabled={isPending} variant="outline" onClick={handleDelete}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default NegotiationCard;
