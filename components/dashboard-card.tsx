"use client";
import React from "react";
import CountAnimation from "./count-animation";
import { useRouter } from "next/navigation";

const DashboardCard = ({ item }: { item: any }) => {
  const router = useRouter();
  return (
    <div
      className="bg-accent py-4 px-5 rounded-md border flex flex-col gap-2"
      onClick={() => {
        router.push(item?.url);
      }}
      data-aos="zoom-in"
    >
      <div className="flex items-center justify-between">
        <h1>{item?.title}</h1>
        <div>{item?.icon && item?.icon}</div>
      </div>

      <CountAnimation number={item?.value ?? 0} className="text-4xl" />
    </div>
  );
};

export default DashboardCard;
