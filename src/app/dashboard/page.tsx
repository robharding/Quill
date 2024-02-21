import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { validateRequest } from "@/lib/auth";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import type { NextPage } from "next";
import { redirect } from "next/navigation";

interface DashboardPageProps {}

const DashboardPage: NextPage<DashboardPageProps> = async ({}) => {
  const { user } = await validateRequest();
  const { isSubscribed } = await getUserSubscriptionPlan();

  if (!user || !user.id) redirect("/login");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/login");

  return <Dashboard user={dbUser} isSubscribed={isSubscribed} />;
};

export default DashboardPage;
