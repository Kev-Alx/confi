"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createNegotiation } from "@/actions/negotiations";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  NegotiationCreateSchemaType,
  createNegotiationSchema,
} from "@/schemas/negotiations";

type Props = {
  fee: number;
  buyerId: string;
};

const ActionButtons = ({ fee, buyerId }: Props) => {
  const NegotiationCreateSchema = createNegotiationSchema();
  const form = useForm<z.infer<typeof NegotiationCreateSchema>>({
    resolver: zodResolver(NegotiationCreateSchema),
    defaultValues: {
      closeDate: undefined,
      negotiatedPrice: fee,
      notes: "",
    },
  });
  const pathname = usePathname();

  const router = useRouter();
  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: NegotiationCreateSchemaType) => {
      const request = await createNegotiation(values);

      if (request.status !== 200) {
        return toast.error("Error making negotiation", {
          description: "Making negotiation failed! Please try again later.",
        });
      }
      return toast("Success", {
        description:
          "Negotiation success, check the open negotiations tab in your profile to see it.",
      });
    },
    onSuccess: () => {
      router.push("/search");
    },
    onError: () => {
      toast.error("Error making negotiation", {
        description: "Making negotiation failed! Please try again later.",
      });
    },
  });

  const onSubmit = (
    data: Omit<z.infer<typeof NegotiationCreateSchema>, "buyerId">
  ) => {
    const val = {
      ...data,
      closeDate: new Date(data.closeDate),
      buyerId: buyerId,
      requestId: pathname.split("/").pop() || "",
    };
    // console.log(val);
    create(val);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={() => form.setValue("negotiatedPrice", fee)}
            className="w-full"
            variant={"outline"}
          >
            Accept
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="font-semibold text-xl">
            Set your fee and preferences
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="negotiatedPrice"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee</FormLabel>
                    <FormDescription>
                      Enter the fee you&apos;d like to charge or leave it as is
                      if you believe it&apos;s fair
                    </FormDescription>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closeDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Close Date</FormLabel>
                    <FormDescription>
                      Set a deadline for the buyer to accept or decline your fee
                      price offer
                    </FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional notes</FormLabel>
                    <FormDescription>
                      Optional, provide any extra details or conditions
                      you&apos;d like to mention
                    </FormDescription>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Request
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionButtons;
