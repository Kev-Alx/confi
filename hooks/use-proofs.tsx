import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { addProof } from "@/actions/proofs";
import { AddProofSchemaType } from "@/schemas/request";

export const useHandleProof = () => {
  const router = useRouter();
  const { mutate: add, isPending } = useMutation({
    mutationFn: async (proof: AddProofSchemaType) => {
      console.log(proof);
      const res = await addProof(proof);

      if (res.status !== 200) {
        return toast.error("Error adding proof", {
          description: "Adding proof failed! Please try again later.",
        });
      }
      return toast("Success", {
        description: "Proof photo added",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return {
    add,
    isPending,
  };
};
