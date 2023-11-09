import { AuthEndpoints, handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  const endpoint = params.kindeAuth as AuthEndpoints;
  return handleAuth(req, endpoint);
}
