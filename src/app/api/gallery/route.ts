import { NextRequest, NextResponse } from "next/server";
import { galleryQuerySchema } from "@/features/gallery/model/schemas";
import { getActiveGalleryImages } from "@/server/gallery/queries/getActiveGalleryImages";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const query = galleryQuerySchema.safeParse(Object.fromEntries(searchParams));
  const hasRepeatedParameters = Array.from(searchParams.keys()).some(
    (key) => searchParams.getAll(key).length > 1,
  );

  if (!query.success || hasRepeatedParameters) {
    return NextResponse.json(
      { error: { message: "Некорректные параметры галереи." } },
      { status: 400 },
    );
  }

  try {
    const images = await getActiveGalleryImages(query.data);
    return NextResponse.json(
      { data: images },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("[gallery] Не удалось получить фотографии из Supabase.");
    return NextResponse.json(
      {
        error: {
          message: "Не удалось загрузить фотографии. Попробуйте ещё раз.",
        },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
