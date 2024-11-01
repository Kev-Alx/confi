"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Item, Proof } from "@prisma/client";

import { SingleImageDropzone } from "@/components/image-dropzone";
import { useHandleProof } from "@/hooks/use-proofs";
import { MAX_FILES_SIZE } from "@/lib/config";
import { useEdgeStore } from "@/lib/edgestore";

type Props = {
  items: (Item & {
    Proof: Proof[];
  })[];
  type: "request" | "preorder";
};

const ProofPage = ({ items }: Props) => {
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileInvoice, setFileInvoice] = useState<File>();
  const [isSubmittingInvoice, setIsSubmittingInvoice] =
    useState<boolean>(false);
  const { add } = useHandleProof();
  return (
    <div>
      <h2 className="font-bold text-lg mt-4">Buying in location photo</h2>
      <p className="text-sm text-muted-foreground my-2">
        These photos serve as proof of purchase from the seller&apos;s location.
        Click &quot;Add photo&quot; to upload the images from the buying
        process, can be the photo of the shop with the item in your hand.
      </p>
      <div className="flex flex-wrap gap-4">
        {items.map((item, i) => {
          return (
            <div
              key={item.id}
              className="bg-slate-100 max-w-[14.5rem] p-4 rounded border w-fit border-dashed border-slate-400 mt-3"
            >
              {item.Proof[i]?.inLocationPhoto ? (
                <Image
                  src={item.Proof[i]?.inLocationPhoto || ""}
                  width={200}
                  height={200}
                  alt="in location proof photo"
                />
              ) : (
                <SingleImageDropzone
                  dropzoneOptions={{
                    maxSize: MAX_FILES_SIZE,
                    maxFiles: 1,
                  }}
                  className="bg-white"
                  disabled={isSubmitting}
                  value={file}
                  onChange={async (file?: File) => {
                    if (file) {
                      setIsSubmitting(true);
                      setFile(file);
                      const res = await edgestore.publicFiles.upload({
                        file,
                      });
                      add({
                        itemId: item.id,
                        inLocationPhoto: res.url,
                        id: item.Proof[i]?.id || "",
                      });
                      setFile(undefined);
                      setIsSubmitting(false);
                    }
                  }}
                />
              )}
              <p className="font-semibold mt-2">{item.name}</p>
            </div>
          );
        })}
      </div>
      <h2 className="font-bold text-lg mt-4">Invoice photo</h2>
      <p className="text-sm text-muted-foreground my-2">
        Upload a clear photo of the invoice received upon purchase for the items
        to ensure the transaction was completed.
      </p>
      <div className="flex flex-wrap gap-4">
        {items.map((item, i) => {
          return (
            <div
              key={item.id}
              className="bg-slate-100 max-w-[14.5rem] p-4 rounded border w-fit border-dashed border-slate-400 mt-3"
            >
              {item.Proof[i]?.invoicePhoto ? (
                <Image
                  src={item.Proof[i]?.invoicePhoto || ""}
                  width={200}
                  height={200}
                  alt="invoice proof photo"
                />
              ) : (
                <SingleImageDropzone
                  dropzoneOptions={{
                    maxSize: MAX_FILES_SIZE,
                    maxFiles: 1,
                  }}
                  className="bg-white"
                  disabled={isSubmittingInvoice}
                  value={fileInvoice}
                  onChange={async (file?: File) => {
                    if (file) {
                      setIsSubmittingInvoice(true);
                      setFileInvoice(file);
                      const res = await edgestore.publicFiles.upload({
                        file,
                      });
                      add({
                        itemId: item.id,
                        invoicePhoto: res.url,
                        id: item.Proof[i]?.id || "",
                      });
                      setFileInvoice(undefined);
                      setIsSubmittingInvoice(false);
                    }
                  }}
                />
              )}
              <p className="font-semibold mt-2">{item.name}</p>
            </div>
          );
        })}
      </div>
      <h2 className="font-bold text-lg mt-4">Legit check certificates photo</h2>
      <p className="text-sm text-muted-foreground my-2">
        Certificates for verifying the authenticity of your items. You&apos;ll
        receive updates from us as soon as the verification is complete.
      </p>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-100 p-4 rounded border w-fit border-dashed border-slate-400 mt-3"
          >
            <div className="bg-white rounded border border-dashed border-slate-400 h-36 w-[12.5rem] flex justify-center items-center">
              <p className="text-muted-foreground text-center text-balance">
                Legit checking not done yet
              </p>
            </div>
            <p className="font-semibold mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProofPage;
