import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextPage } from "next";
import { redirect } from "next/navigation";

interface DashboardPageProps {}

const DashboardPage: NextPage<DashboardPageProps> = async ({}) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const { isSubscribed } = await getUserSubscriptionPlan();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard user={dbUser} isSubscribed={isSubscribed} />;
};

export default DashboardPage;
