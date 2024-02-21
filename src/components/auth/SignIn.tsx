import Link from "next/link";
import UserAuthForm from "./UserAuthForm";
import { FC } from "react";

interface SignInProps {
  isModal?: boolean;
}

const SignIn: FC<SignInProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        <UserAuthForm className="flex justify-center" />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to Breadit?{" "}
          <Link
            href="signup"
            className="hover:text-zinc-800 underline underline-offset-4"
            replace={isModal}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
