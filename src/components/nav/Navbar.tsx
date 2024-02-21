import { FC } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const { user } = await validateRequest();
  const { isSubscribed } = await getUserSubscriptionPlan();

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold ">
            <span>quill.</span>
          </Link>

          <MobileNav isAuthed={!!user} isSubscribed={isSubscribed} />

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href="/pricing"
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  email={dbUser?.email ?? ""}
                  imageUrl={dbUser?.avatarUrl ?? ""}
                  name={user.username || "Your Account"}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
