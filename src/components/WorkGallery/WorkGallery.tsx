"use client";

import { useState } from "react";
import { Image } from "antd";
import { GalleryImageCard } from "@/components/GalleryImageCard";
import type { GalleryImage } from "@/features/gallery/model/types";
import styles from "./WorkGallery.module.css";

type WorkGalleryProps = {
  images: GalleryImage[];
};

export const WorkGallery = ({ images }: WorkGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <Image.PreviewGroup
      items={images.map((image) => ({ src: image.imageUrl, alt: image.title }))}
      preview={{
        open: isPreviewOpen,
        current: currentImage,
        onOpenChange: setIsPreviewOpen,
        onChange: setCurrentImage,
        countRender: (current, total) => (
          <span>
            {images[current - 1]?.title} · {current} / {total}
          </span>
        ),
      }}
    >
      <ul className={styles.grid} aria-label="Фотографии ресниц и бровей">
        {images.map((image, index) => (
          <li className={styles.item} key={image.id}>
            <GalleryImageCard
              image={image}
              onOpen={() => {
                setCurrentImage(index);
                setIsPreviewOpen(true);
              }}
            />
          </li>
        ))}
      </ul>
    </Image.PreviewGroup>
  );
};
