"use client";

import { Button, Empty, Skeleton } from "antd";
import { WorkGallery } from "@/components/WorkGallery";
import { useGalleryImages } from "../../hooks/useGalleryImages";
import { galleryContent } from "../../model/content";
import type { GalleryQuery } from "../../model/types";
import styles from "./GalleryCollection.module.css";

interface GalleryCollectionProps {
  query?: GalleryQuery;
}

export const GalleryCollection = ({ query = {} }: GalleryCollectionProps) => {
  const galleryQuery = useGalleryImages(query);
  const skeletonCount = query.limit ?? 8;

  return (
    <>
      <div aria-busy={galleryQuery.isPending}>
        {galleryQuery.isPending ? (
          <>
            <p className={styles.loadingLabel} role="status">
              Загрузка фотографий…
            </p>
            <div className={styles.skeletonGrid} aria-hidden="true">
              {Array.from({ length: skeletonCount }, (_, index) => (
                <div className={styles.skeleton} key={index}>
                  <Skeleton.Image active />
                </div>
              ))}
            </div>
          </>
        ) : galleryQuery.isError ? (
          <div className={styles.state} role="alert">
            <h3 className={styles.stateTitle}>
              Не удалось загрузить фотографии
            </h3>
            <p>Попробуйте обновить галерею ещё раз.</p>
            <Button
              className={styles.retryButton}
              loading={galleryQuery.isFetching}
              onClick={() => void galleryQuery.refetch()}
            >
              Попробовать снова
            </Button>
          </div>
        ) : galleryQuery.data.length === 0 ? (
          <div className={styles.state} role="status">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Фотографии скоро появятся"
            />
          </div>
        ) : (
          <WorkGallery images={galleryQuery.data} />
        )}
      </div>
      <p className={styles.note}>{galleryContent.note}</p>
    </>
  );
};
