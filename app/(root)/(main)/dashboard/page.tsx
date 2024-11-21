"use client";
import DashboardCard from "@/components/dashboard-card";
import DashboardOverview from "@/components/DashboardOverview";
import { UserContext } from "@/contexts/UserContext";
import { GetGreeting } from "@/utils/General_Functions";
import React, { useContext } from "react";

export default function Page() {
  const { StoreData } = useContext(UserContext);
  return (
    <div>
      <div>
        <h1>
          {GetGreeting()}&nbsp;
          {StoreData?.name}
        </h1>
        <DashboardOverview />
      </div>
    </div>
  );
}
