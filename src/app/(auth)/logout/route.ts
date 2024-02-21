import { logout } from "@/lib/auth";

export function GET() {
  return logout();
}
