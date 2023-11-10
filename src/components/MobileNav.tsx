"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface MobileNavProps {
  isAuthed: boolean;
}

const MobileNav: FC<MobileNavProps> = ({ isAuthed }) => {
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
      />

      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuthed ? (
              <>
                <li>
                  <Link
                    className="flex items-center w-full font-semibold text-green-600"
                    href="/sign-up"
                    onClick={() => closeOnCurrent("/sign-up")}
                  >
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/sign-in"
                    onClick={() => closeOnCurrent("/sign-in")}
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
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/dashboard/billing"
                    onClick={() => closeOnCurrent("/dashboard/billing")}
                  >
                    Billing
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/sign-out"
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
