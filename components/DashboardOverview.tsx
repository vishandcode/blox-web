"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "./dashboard-card";
import { UserAxiosInstance } from "@/utils/Instance";
import { FaBoxes } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { TimerIcon } from "lucide-react";

const DashboardOverview = () => {
  const [Data, SetData] = useState<any>([]);

  const FetchData = async () => {
    try {
      const response = await UserAxiosInstance.get("/users/dashboard-stats");
      console.log(response.data);
      SetData([
        {
          title: "Total Products",
          value: response?.data?.payload?.total_products,
          icon: <FaBoxes />,
          url: "/products",
        },
        {
          title: "Total Transactions",
          value: response?.data?.payload?.total_transactions,
          icon: <GrTransaction />,
          url: "/transactions",
        },
        {
          title: "Transaction Requests",
          value: response?.data?.payload?.total_transaction_requests_awaiting,
          icon: <TimerIcon />,
          url: "/transactions?status=pending",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
    return;
  }, []);

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-6 gap-4 py-4 ">
        {Data?.map((item: any, index: number) => (
          <DashboardCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
