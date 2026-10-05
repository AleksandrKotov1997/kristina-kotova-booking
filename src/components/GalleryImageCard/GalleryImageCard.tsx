"use client";

import { useState } from "react";
import { Image } from "antd";
import type { GalleryImage } from "@/features/gallery/model/types";
import styles from "./GalleryImageCard.module.css";

type GalleryImageCardProps = {
  image: GalleryImage;
  onOpen: () => void;
};

export const GalleryImageCard = ({ image, onOpen }: GalleryImageCardProps) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <button
      type="button"
      className={styles.card}
      aria-label={"Открыть фото: " + image.title}
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <Image
        src={image.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        preview={false}
        width="100%"
        height="100%"
        classNames={{ root: styles.imageRoot, image: styles.image }}
        onError={() => setFailedUrl(image.imageUrl)}
        onLoad={() => setFailedUrl(null)}
      />
      {failedUrl === image.imageUrl && (
        <span className={styles.fallback}>Фото недоступно</span>
      )}
      <span className={styles.badge} aria-hidden="true">
        Фото
      </span>
      <span className={styles.caption} aria-hidden="true">
        {image.title}
      </span>
      <span className={styles.overlay} aria-hidden="true">
        <span className={styles.openLabel}>Смотреть</span>
      </span>
    </button>
  );
};
