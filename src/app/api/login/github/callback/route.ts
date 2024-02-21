import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "@/db";

// user is redirected here if they successfuly authenticate with GitHub

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code"); // temp code
  const state = url.searchParams.get("state"); // anti-forgery state token
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || state !== storedState) {
    // if states dont match, third party created the request
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // With this token we can make requests to the GitHub API on the user's behalf
    const tokens = await github.validateAuthorizationCode(code); // POST https://github.com/login/oauth/access_token

    // Get user details from GitHub
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    // Find existing user with matching github id
    const existingUser = await db.user.findFirst({
      where: {
        githubId: githubUser.id,
      },
    });

    // if user exists log in and redirect to home
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
        },
      });
    }

    // if user doesnt exist create new user, log in, and redirect to home
    const userId = generateId(15);
    await db.user.create({
      data: {
        githubId: githubUser.id,
        id: userId,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        username: githubUser.login,
      },
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  email: string;
}
