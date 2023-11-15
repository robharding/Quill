"use client";

import { FC } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

interface UpgradeButtonProps {}

const UpgradeButton: FC<UpgradeButtonProps> = ({}) => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });

  return (
    <Button
      className="w-full"
      onClick={() => createStripeSession()}
      data-umami-event="pricing-upgrade-button-clicked"
    >
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
