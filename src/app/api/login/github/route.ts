import { generateState } from "arctic";
import { github } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const state = generateState(); // generate an unguessable random string
  const url = await github.createAuthorizationURL(state);

  cookies().set("github_oauth_state", state, {
    path: "/", // available to any subdirectories of the root
    secure: process.env.NODE_ENV === "production", // don't send cookie unless its HTTPS in production
    httpOnly: true, // only accessible by the server, not by client-side javascript
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url); // https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&state=...
  // callback set in GitHub OAuth app settings
  // /login/github/callback
}
