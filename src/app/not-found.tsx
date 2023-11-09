import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto mt-12 text-center">
      <h2 className="text-xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className={buttonVariants({ className: "mt-2", variant: "outline" })}
      >
        Return Home
      </Link>
    </div>
  );
}
