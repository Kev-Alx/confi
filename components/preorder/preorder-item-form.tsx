"use client";

import Image from "next/image";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

import { SingleImageDropzone } from "@/components/image-dropzone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import { capitalize } from "@/lib/utils";
import {
  PreorderDetailsSchemaItem,
  PreorderDetailsSchemaItemType,
} from "@/schemas/preorder";

/* eslint-disable @typescript-eslint/no-unused-vars */

const PreorderItemForm = ({
  onClose,
  isPending,
}: {
  isPending: boolean;
  onClose: () => void;
}) => {
  const { edgestore } = useEdgeStore();
  const [_, setItems] = useLocalStorage<PreorderDetailsSchemaItemType[]>(
    "preorder-items",
    []
  );
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof PreorderDetailsSchemaItem>>({
    resolver: zodResolver(PreorderDetailsSchemaItem),
    defaultValues: {
      category: Category.FASHION,
      name: "",
      description: "",
      link: "",
      price: 0,
      amount: 1,
      photos: [],
      tips: 0,
      notes: "",
    },
  });
  const onSubmit = (data: z.infer<typeof PreorderDetailsSchemaItem>) => {
    // console.log(data);
    setItems((prev) => [...prev, data]);
    onClose();
  };

  return (
    <div className="@container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col w-full @2xl:flex-row gap-4"
        >
          <FormField
            control={form.control}
            name={"photos"}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Item photos</FormLabel>
                {field.value.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-1 place-items-center gap-4 relative">
                    {field.value.map((img) => (
                      <div
                        key={img.url}
                        className="relative min-h-24 w-48 md:w-64 bg-muted max-w-64 max-md:odd:last:col-span-2"
                      >
                        <Image
                          width={180}
                          height={120}
                          src={img.url}
                          className="w-full rounded"
                          alt="Image"
                        />
                        <Button
                          className="absolute h-6 w-6 top-1 right-1"
                          size={"icon"}
                          variant={"destructive"}
                          onClick={async () => {
                            field.onChange(
                              ...field.value.filter((i) => i.url !== img.url)
                            );
                            await edgestore.publicFiles.delete({
                              url: img.url,
                            });
                          }}
                        >
                          <XIcon />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <FormControl>
                  {field.value.length < 3 && (
                    <SingleImageDropzone
                      className="w-full md:max-w-64 mx-auto outline-none"
                      disabled={isSubmitting}
                      value={file}
                      onChange={async (file?: File) => {
                        if (file) {
                          setIsSubmitting(true);
                          setFile(file);
                          if (field.value.length > 3) {
                            return;
                          }
                          try {
                            const res = await edgestore.publicFiles.upload({
                              file,
                            });
                            field.onChange([...field.value, { url: res.url }]);
                          } catch (error) {
                            toast.error(
                              "Failed to upload image, please try again later"
                            );
                          } finally {
                            setFile(undefined);
                            setIsSubmitting(false);
                          }
                          // await update({
                          //   id: params.documentId as Id<"documents">,
                          //   coverImage: res.url,
                          // });
                        }
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 flex-1">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item name</FormLabel>
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
              disabled={isPending}
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
              name="link"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product link</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Category).map((category) => (
                        <SelectItem key={category} value={category}>
                          {capitalize(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Rp," />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tips"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Rp," />
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PreorderItemForm;
