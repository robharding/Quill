"use client";

import type { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthCallbackPageProps {}

const AuthCallbackPage: NextPage<AuthCallbackPageProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { mutate: authCallback, isLoading } = trpc.authCallback.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        router.push(origin || "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
  });

  useEffect(() => {
    authCallback();
  }, [authCallback]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
