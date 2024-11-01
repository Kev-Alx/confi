"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { verifyJastiper } from "@/actions/jastiper";
import { SingleImageDropzone } from "@/components/image-dropzone";
import { Button } from "@/components/ui/button";
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
import { MAX_FILES_SIZE } from "@/lib/config";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { VerifyIdentitySchema } from "@/schemas/jastiper";

import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const JastiperForm = () => {
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  //   const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof VerifyIdentitySchema>>({
    resolver: zodResolver(VerifyIdentitySchema),
    defaultValues: {
      namaKtp: "",
      dob: undefined,
      address: "",
      ktpPhoto: "",
    },
  });
  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof VerifyIdentitySchema>) => {
      const request = await verifyJastiper(values);

      if (request.status !== 200) {
        return toast.error("Error registering as Jastiper", {
          description: "Register failed! Please try again later.",
        });
      }
      return toast("Success", {
        description: (
          <span className="text-sm text-muted-foreground">
            Congrats. You are now a Jastiper, start
            <span className="italic"> titip </span>now
          </span>
        ),
      });
    },
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["requests"] });
      router.refresh();
    },
  });
  const onSubmit = (data: z.infer<typeof VerifyIdentitySchema>) => {
    // console.log(data);
    create(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col w-full @2xl:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <FormField
            control={form.control}
            name="namaKtp"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
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
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>
                  The last date when buyers can join or request from the
                  preorder
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"ktpPhoto"}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Photo of your KTP</FormLabel>
                {field.value.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-1 place-items-center gap-4 relative">
                    <div className="relative min-h-24 w-48 md:w-64 bg-muted max-w-64 max-md:odd:last:col-span-2">
                      <Image
                        width={180}
                        height={120}
                        src={field.value}
                        className="w-full rounded"
                        alt="Image"
                      />
                      <Button
                        className="absolute h-6 w-6 top-1 right-1"
                        size={"icon"}
                        variant={"destructive"}
                        onClick={async () => {
                          field.onChange("");
                          await edgestore.publicFiles.delete({
                            url: field.value,
                          });
                        }}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  </div>
                )}
                <FormControl>
                  {field.value.length === 0 && (
                    <SingleImageDropzone
                      dropzoneOptions={{
                        maxSize: MAX_FILES_SIZE,
                        maxFiles: 1,
                      }}
                      className="w-full outline-none mb-6"
                      disabled={isSubmitting}
                      value={file}
                      onChange={async (file?: File) => {
                        if (file) {
                          setIsSubmitting(true);
                          setFile(file);
                          if (field.value.length > 0) {
                            return;
                          }
                          const res = await edgestore.publicFiles.upload({
                            file,
                          });
                          field.onChange(res.url);
                          // await update({
                          //   id: params.documentId as Id<"documents">,
                          //   coverImage: res.url,
                          // });
                          setFile(undefined);
                          setIsSubmitting(false);
                        }
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Request</Button>
        </div>
      </form>
    </Form>
  );
};

export default JastiperForm;
