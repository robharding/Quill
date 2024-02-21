import { FC } from "react";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

interface SignUpProps {
  isModal?: boolean;
}

const SignUp: FC<SignUpProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        <UserAuthForm className="flex justify-center" />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already a Breaditor?{" "}
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 underline underline-offset-4"
            replace={isModal}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
