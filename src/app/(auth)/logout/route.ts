import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  await logout();

  return Response.redirect("/");
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.validateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return { error: null };
}

interface ActionResult {
  error: string | null;
}
