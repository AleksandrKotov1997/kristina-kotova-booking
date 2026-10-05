"use client";

import { Button, Empty, Skeleton } from "antd";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkGallery } from "@/components/WorkGallery";
import { useGalleryImages } from "@/features/gallery/hooks/useGalleryImages";
import { homeGalleryLimit } from "@/features/gallery/model/constants";
import styles from "./HomeWorksPreview.module.css";

export const HomeWorksPreview = () => {
  const galleryQuery = useGalleryImages({ limit: homeGalleryLimit });

  return (
    <section
      id="works"
      className={styles.section}
      aria-labelledby="works-title"
    >
      <PageContainer>
        <SectionHeading
          id="works-title"
          eyebrow="Портфолио"
          title="Работы"
          description="Ресницы и брови: идеи образов и примеры ухода. Здесь появятся фотографии работ Кристины."
        />
        <div aria-busy={galleryQuery.isPending}>
          {galleryQuery.isPending ? (
            <>
              <p className={styles.loadingLabel} role="status">
                Загрузка фотографий…
              </p>
              <div className={styles.skeletonGrid} aria-hidden="true">
                {Array.from({ length: homeGalleryLimit }, (_, index) => (
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
        <p className={styles.note}>
          Стоковые фотографии для иллюстрации · Реальные работы Кристины добавим
          позже
        </p>
      </PageContainer>
    </section>
  );
};
