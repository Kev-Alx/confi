"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import { Drawer } from "vaul";

import { createPreorder } from "@/actions/preorder";
import PreorderItemForm from "@/components/preorder/preorder-item-form";
import RequestCard from "@/components/request/request-card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEdgeStore } from "@/lib/edgestore";
import {
  PreorderDetailsSchemaItemType,
  PreorderDetailsSchemaType,
  PreorderSchemaCompleteType,
} from "@/schemas/preorder";

const Page = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const isClient = useIsClient();

  const [details, setDetails] = useLocalStorage<PreorderDetailsSchemaType>(
    "preorder-details",
    {} as PreorderDetailsSchemaType
  );
  const [items, setItems] = useLocalStorage<PreorderDetailsSchemaItemType[]>(
    "preorder-items",
    []
  );
  const router = useRouter();
  if (!details) {
    router.push("/preorder/create");
  }
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: PreorderSchemaCompleteType) => {
      const preorder = await createPreorder(values);

      if (preorder.status !== 200) {
        return toast.error("Error creating preorder", {
          description: "Preorder creation failed! Please try again later.",
        });
      }

      return toast("Success", {
        description: "Preorder created",
      });
    },
    onSuccess: () => {
      setDetails({} as PreorderDetailsSchemaType);
      setItems([]);
      queryClient.invalidateQueries({ queryKey: ["preorders"] });
      router.push("/search?type=preorder");
    },
  });

  const onSubmit = () => {
    const value = {
      details: {
        ...details,
        closeDate: new Date(details.closeDate),
      },
      items: items,
    } satisfies PreorderSchemaCompleteType;

    // console.log(value);
    create(value);
  };

  const removeItem = async (item: PreorderDetailsSchemaItemType) => {
    setItems((prev) => prev.filter((i) => i.name !== item.name));

    await Promise.all(
      item.photos.map(async (img) => {
        await edgestore.publicFiles.delete({
          url: img.url,
        });
      })
    );
  };

  if (!isClient) return;

  return (
    <section className="flex flex-col gap-4 relative">
      <p className="text-muted-foreground text-sm">
        Add items to your pre-order, you can leave it empty if you are not
        planning on buying a specific item but make sure to make the pre-order
        requestable so buyers can still <span className="italic">Titip</span>
      </p>
      <div className="grid @container sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div className="relative w-full @sm:w-fit" key={item.photos[0].url}>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => removeItem(item)}
              className="absolute h-8 w-8 right-2 top-2 bg-red-600 hover:bg-red-500 text-white"
            >
              <XIcon />
            </Button>
            {/* @ts-expect-error types not matching */}
            <RequestCard item={item} />
          </div>
        ))}
        <Drawer.Root
          open={open}
          onOpenChange={setOpen}
          direction={isMobile ? "bottom" : "right"}
        >
          <Drawer.Trigger>
            <div className="bg-slate-50 cursor-pointer h-full min-h-56  hover:bg-slate-100 border-dashed border-slate-300 border rounded flex justify-center items-center flex-col">
              <PlusIcon className="text-black" />
              <span className="text-black font-medium">Add item</span>
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-20 bg-black/60" />
            <Drawer.Content
              className="right-0 md:right-3 rounded-lg md:top-3 bottom-0 md:bottom-3 fixed z-50 outline-none w-full md:w-[480px] flex"
              style={
                {
                  "--initial-transform": "calc(100% + 8px)",
                } as React.CSSProperties
              }
            >
              <div className="bg-zinc-50 h-full max-md:max-h-[calc(100vh-4rem)] w-full grow p-5 flex flex-col gap-8 rounded-t-lg md:rounded-lg overflow-y-auto">
                <div className="md:hidden mx-auto h-2 w-[100px] text-transparent rounded-full bg-muted">
                  handle
                </div>
                <PreorderItemForm
                  onClose={() => setOpen(false)}
                  isPending={isPending}
                />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <Button onClick={onSubmit} disabled={isPending}>
        Done
      </Button>
    </section>
  );
};

export default Page;
