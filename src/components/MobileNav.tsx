"use client";

import { ArrowRight, Gem, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface MobileNavProps {
  isAuthed: boolean;
  isSubscribed: boolean;
}

const MobileNav: FC<MobileNavProps> = ({ isAuthed, isSubscribed }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // close nav when pathname or isOpen changes
  const pathname = usePathname();
  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) toggleOpen();
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-4 w-4 text-zinc-700"
        data-umami-event="mobile-nav-button-clicked"
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuthed ? (
              <>
                <li>
                  <Link
                    className="flex items-center w-full font-semibold text-green-600"
                    href="/signup"
                    onClick={() => closeOnCurrent("/signup")}
                    data-umami-event="mobile-get-started-button-clicked"
                  >
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/login"
                    onClick={() => closeOnCurrent("/login")}
                    data-umami-event="mobile-sign-in-button-clicked"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                    onClick={() => closeOnCurrent("/pricing")}
                    data-umami-event="mobile-pricing-button-clicked"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                    onClick={() => closeOnCurrent("/dashboard")}
                    data-umami-event="mobile-dashboard-button-clicked"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                {!isSubscribed ? (
                  <li>
                    <Link
                      href="/pricing"
                      className="flex items-center w-full font-semibold"
                      data-umami-event="mobile-upgrade-button-clicked"
                    >
                      Upgrade <Gem className="text-blue-600 h-4 w-4 ml-1.5" />
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      className="flex items-center w-full font-semibold"
                      href="/dashboard/billing"
                      onClick={() => closeOnCurrent("/dashboard/billing")}
                      data-umami-event="mobile-manage-subscription-button-clicked"
                    >
                      Manage Subscription
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/sign-out"
                    data-umami-event="mobile-sign-out-button-clicked"
                  >
                    Sign Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
