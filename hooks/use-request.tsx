import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRequests } from "@/actions/request";

export const useHandleReqiuest = () => {
  const router = useRouter();
  const { mutate: deleteRequest, isPending: isPendingDelete } = useMutation({
    mutationFn: async (reqId: string) => {
      const negotiation = await deleteRequests(reqId);

      if (negotiation.status !== 200) {
        return toast.error("Error deleting request", {
          description:
            "Request already accepted by jastiper, it cannot be canceled.",
        });
      }

      return toast("Success", {
        description: "Request deleted",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return {
    deleteRequest,
    isPendingDelete,
  };
};
