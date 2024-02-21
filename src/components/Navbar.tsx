import { FC } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import MobileNav from "./MobileNav";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";
import NavAuthButtons from "./auth/NavAuthButtons";

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
                  data-umami-event="nav-pricing-button-clicked"
                >
                  Pricing
                </Link>
                <NavAuthButtons />
              </>
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href="/dashboard"
                  data-umami-event="nav-dashboard-button-clicked"
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
