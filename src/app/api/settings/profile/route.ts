import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in again." }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      jobTitle: true,
      phone: true,
      address: true,
      timezone: true,
      currency: true,
      locale: true,
      theme: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "That account no longer exists." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You need to sign in again." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body wasn't valid JSON." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some fields need attention.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  try {
    // Scoped by id: a request can only ever write the signed-in user's row.
    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        jobTitle: data.jobTitle || null,
        phone: data.phone || null,
        address: data.address || null,
        timezone: data.timezone,
        currency: data.currency.toUpperCase(),
        locale: data.locale,
        theme: data.theme,
      },
      select: {
        id: true,
        name: true,
        email: true,
        jobTitle: true,
        phone: true,
        address: true,
        timezone: true,
        currency: true,
        locale: true,
        theme: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "PROFILE_UPDATED",
        entityType: "User",
        entityId: user.id,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/settings/profile", error);
    return NextResponse.json(
      { error: "Your profile couldn't be saved. Try again." },
      { status: 500 },
    );
  }
}
