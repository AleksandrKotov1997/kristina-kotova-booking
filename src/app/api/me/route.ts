import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findDemoUserById,
  getDemoUserById,
} from "@/features/currentUser/model/constants";
import { updateCurrentUserSchema } from "@/features/currentUser/model/schemas";

export const GET = async () => {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("currentUserId")?.value;
  const currentUser = findDemoUserById(currentUserId);
  return NextResponse.json(currentUser);
};

export const PATCH = async (request: Request) => {
  const rawBody = await request.json().catch(() => null);
  const parsedBody = updateCurrentUserSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Invalid current user payload" },
      { status: 400 },
    );
  }

  const currentUser = getDemoUserById(parsedBody.data.userId);

  if (!currentUser) {
    return NextResponse.json(
      { message: "Current user was not found" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("currentUserId", currentUser.id, { path: "/" });

  return NextResponse.json(currentUser);
};
