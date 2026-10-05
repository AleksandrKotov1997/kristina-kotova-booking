import { NextRequest, NextResponse } from "next/server";
import { servicesQuerySchema } from "@/features/services/model/schemas";
import { getActiveServices } from "@/server/services/queries/getActiveServices";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const query = servicesQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!query.success || searchParams.getAll("category").length > 1) {
    return NextResponse.json(
      { error: { message: "Некорректные параметры каталога услуг." } },
      { status: 400 },
    );
  }

  try {
    const services = await getActiveServices(query.data);

    return NextResponse.json(
      { data: services },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error("[services] Не удалось получить каталог из Supabase.");

    return NextResponse.json(
      {
        error: { message: "Не удалось загрузить услуги. Попробуйте ещё раз." },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
