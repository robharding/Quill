import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export function GET() {
  logout();

  return redirect("/");
}
