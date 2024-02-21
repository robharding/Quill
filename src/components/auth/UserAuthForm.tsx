import React, { FC } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  // TODO: Callback URL

  return (
    <div className={cn(className)} {...props}>
      <Link
        href="/api/login/github"
        className={cn(buttonVariants({ size: "sm" }), "w-full")}
        prefetch={false}
      >
        Github
      </Link>
    </div>
  );
};

export default UserAuthForm;
