"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

import { SingleImageDropzone } from "@/components/image-dropzone";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Switch } from "@/components/ui/switch";
import { MAX_FILES_SIZE } from "@/lib/config";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import {
  PreorderDetailsSchema,
  PreorderDetailsSchemaType,
} from "@/schemas/preorder";

/* eslint-disable @typescript-eslint/no-unused-vars */

const Page = () => {
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [_, setDetails] = useLocalStorage<PreorderDetailsSchemaType>(
    "preorder-details",
    {} as PreorderDetailsSchemaType
  );
  const form = useForm<z.infer<typeof PreorderDetailsSchema>>({
    resolver: zodResolver(PreorderDetailsSchema),
    defaultValues: {
      title: "",
      location: "",
      closeDate: undefined,
      isRequestable: false,
      coverImage: "",
      description: "",
    },
  });
  const onSubmit = (data: z.infer<typeof PreorderDetailsSchema>) => {
    console.log(data);
    setDetails(data);
    router.push("/preorder/create/items");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"coverImage"}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Cover image</FormLabel>
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
        <FormField
          control={form.control}
          name="closeDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Close Date</FormLabel>
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
              <FormDescription>
                The last date when buyers can join or request from the preorder
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isRequestable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg py-4">
              <div className="space-y-0.5">
                <FormLabel>Requestable</FormLabel>
                <FormDescription>
                  Enable buyers to request items that are not listed in the
                  preorder
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default Page;
