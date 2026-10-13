"use client";
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Image } from "antd";
import { GalleryImageCard } from "@/components/GalleryImageCard";
import type { GalleryImage } from "@/features/gallery/model/types";
import styles from "./WorkGallery.module.css";

type WorkGalleryProps = { images: GalleryImage[] };
const previewLabels: Record<string, string> = {
  flipY: "Отразить по вертикали",
  flipX: "Отразить по горизонтали",
  rotateLeft: "Повернуть влево",
  rotateRight: "Повернуть вправо",
  zoomOut: "Уменьшить",
  zoomIn: "Увеличить",
};
const translatePreviewControls = (controls: ReactNode) => {
  if (!isValidElement<{ children?: ReactNode }>(controls)) return controls;
  return cloneElement(
    controls,
    {},
    Children.map(controls.props.children, (control) => {
      if (
        !isValidElement<ButtonHTMLAttributes<HTMLButtonElement>>(control) ||
        control.type !== "button"
      )
        return control;
      const label = previewLabels[control.props["aria-label"] ?? ""];
      return label
        ? cloneElement(control, { "aria-label": label, title: label })
        : control;
    }),
  );
};
const PreviewIcon = ({ label, path }: { label: string; path: string }) => (
  <svg
    role="img"
    aria-label={label}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d={path} />
  </svg>
);
export const WorkGallery = ({ images }: WorkGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
    <Image.PreviewGroup
      classNames={{ popup: { root: styles.preview } }}
      items={images.map((image) => ({ src: image.imageUrl, alt: image.title }))}
      preview={{
        open: isPreviewOpen,
        current: currentImage,
        alt: images[currentImage]?.title ?? "Фотография ресниц и бровей",
        onOpenChange: setIsPreviewOpen,
        onChange: setCurrentImage,
        closeIcon: (
          <PreviewIcon label="Закрыть фотографию" path="M6 6L18 18M18 6L6 18" />
        ),
        actionsRender: translatePreviewControls,
        imageRender: (image) => (
          <>
            {image}
            <button
              type="button"
              className={styles.previousPhoto}
              aria-label="Предыдущая фотография"
              title="Предыдущая фотография"
              disabled={currentImage === 0}
              onClick={() => setCurrentImage(currentImage - 1)}
            >
              <span aria-hidden="true">
                <PreviewIcon
                  label="Предыдущая фотография"
                  path="M15 4L7 12L15 20"
                />
              </span>
            </button>
            <button
              type="button"
              className={styles.nextPhoto}
              aria-label="Следующая фотография"
              title="Следующая фотография"
              disabled={currentImage === images.length - 1}
              onClick={() => setCurrentImage(currentImage + 1)}
            >
              <span aria-hidden="true">
                <PreviewIcon
                  label="Следующая фотография"
                  path="M9 4L17 12L9 20"
                />
              </span>
            </button>
          </>
        ),
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
