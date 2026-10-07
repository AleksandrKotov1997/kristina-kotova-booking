import { NextRequest, NextResponse } from "next/server";
import { workingHoursQuerySchema } from "@/features/workingHours/model/schemas";
import { getWorkingHours } from "@/server/workingHours/queries/getWorkingHours";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const query = workingHoursQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!query.success) {
    return NextResponse.json(
      { error: { message: "Некорректные параметры режима работы." } },
      { status: 400 },
    );
  }

  try {
    const workingHours = await getWorkingHours();
    return NextResponse.json(
      { data: workingHours },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    console.error(
      "[working-hours] Не удалось получить расписание из Supabase.",
    );
    return NextResponse.json(
      {
        error: {
          message: "Не удалось загрузить режим работы. Попробуйте ещё раз.",
        },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
};
