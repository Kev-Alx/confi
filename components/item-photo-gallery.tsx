"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Media } from "@prisma/client";

type Props = {
  photos: Media[];
};

const ItemPhotoGallery = ({ photos }: Props) => {
  const [largeImage, setLargeImage] = useState(photos[0].url);
  const [smallImages, setSmallImages] = useState(
    photos.slice(1).map((img) => img.url)
  );

  const handleImageClick = (selectedImage: string) => {
    setSmallImages((prev) => {
      const newSmallImages = prev.map((img) =>
        img === selectedImage ? largeImage : img
      );
      setLargeImage(selectedImage);
      return newSmallImages;
    });
  };
  if (photos.length === 1) {
    return (
      <Image
        src={photos[0].url}
        className="w-full h-full object-cover rounded-lg max-h-80"
        width={430}
        height={339}
        alt="Item photo"
      />
    );
  }

  return (
    <div className="w-full flex flex-col-reverse gap-4 lg:grid lg:grid-cols-[1fr_3fr] items-start min-h-80">
      <div className="flex lg:flex-col gap-2 relative w-fit lg:w-full bg-slate-50 rounded-none p-2">
        {smallImages.map((img) => (
          <Image
            src={img}
            className="w-full aspect-square h-full max-h-32 sm:max-h-20 lg:max-h-36 object-cover rounded-lg cursor-pointer"
            width={139}
            height={216}
            alt="Item photo"
            key={img}
            onClick={() => handleImageClick(img)}
          />
        ))}
      </div>

      <div className="relative w-full ">
        <Image
          src={largeImage}
          className="w-full h-full object-contain bg-slate-100 rounded-lg max-h-64"
          width={430}
          height={339}
          alt="Item photo"
        />
      </div>
    </div>
  );
};

export default ItemPhotoGallery;
