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
import { useTranslations } from "next-intl";
import { GalleryImageCard } from "@/components/GalleryImageCard";
import type { GalleryImage } from "@/features/gallery/model/types";
import styles from "./WorkGallery.module.css";

type WorkGalleryProps = { images: GalleryImage[] };
const translatePreviewControls = (
  controls: ReactNode,
  previewLabels: Record<string, string>,
) => {
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
  const t = useTranslations("Gallery");
  const previewLabels = {
    flipY: t("flipY"),
    flipX: t("flipX"),
    rotateLeft: t("rotateLeft"),
    rotateRight: t("rotateRight"),
    zoomOut: t("zoomOut"),
    zoomIn: t("zoomIn"),
  };
  const [currentImage, setCurrentImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
    <Image.PreviewGroup
      classNames={{ popup: { root: styles.preview } }}
      items={images.map((image) => ({ src: image.imageUrl, alt: image.title }))}
      preview={{
        open: isPreviewOpen,
        current: currentImage,
        alt: images[currentImage]?.title ?? t("fallbackAlt"),
        onOpenChange: setIsPreviewOpen,
        onChange: setCurrentImage,
        closeIcon: (
          <PreviewIcon label={t("close")} path="M6 6L18 18M18 6L6 18" />
        ),
        actionsRender: (controls) =>
          translatePreviewControls(controls, previewLabels),
        imageRender: (image) => (
          <>
            {image}
            <button
              type="button"
              className={styles.previousPhoto}
              aria-label={t("previous")}
              title={t("previous")}
              disabled={currentImage === 0}
              onClick={() => setCurrentImage(currentImage - 1)}
            >
              <span aria-hidden="true">
                <PreviewIcon label={t("previous")} path="M15 4L7 12L15 20" />
              </span>
            </button>
            <button
              type="button"
              className={styles.nextPhoto}
              aria-label={t("next")}
              title={t("next")}
              disabled={currentImage === images.length - 1}
              onClick={() => setCurrentImage(currentImage + 1)}
            >
              <span aria-hidden="true">
                <PreviewIcon label={t("next")} path="M9 4L17 12L9 20" />
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
      <ul className={styles.grid} aria-label={t("photos")}>
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
