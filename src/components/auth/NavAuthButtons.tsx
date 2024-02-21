"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants } from "../ui/button";

interface NavAuthButtonsProps {}

const NavAuthButtons: FC<NavAuthButtonsProps> = ({}) => {
  return (
    <>
      <Link
        href="/login"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
        })}
        data-umami-event="nav-sign-in-button-clicked"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className={buttonVariants({
          size: "sm",
        })}
        data-umami-event="nav-get-started-button-clicked"
      >
        Get started <ArrowRight className="ml-1.5 h-5 w-5" />
      </Link>
    </>
  );
};

export default NavAuthButtons;
