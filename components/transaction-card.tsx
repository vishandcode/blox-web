"use client";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Button } from "./ui/button";

export default function TransactionCard({ transaction }: { transaction: any }) {
  const router = useRouter();
  const { StoreData } = useContext(UserContext);
  return (
    <div
      className="bg-accent p-3 rounded-md border cursor-pointer"
      onClick={() => {
        router.push(
          `/transactions/transaction-history?id=` +
            transaction?.product_details?._id
        );
      }}
      data-aos="zoom-in"
    >
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-neutral-500 text-sm"> Name</h1>
          <h1 className="text-sm">{transaction?.product_details?.name}</h1>
        </div>
        <div>
          <h1 className="text-neutral-500 text-sm">Number of pipelines</h1>
          <h1 className="text-sm">{transaction?.transactions?.length ?? 0}</h1>
        </div>
      </div>
    </div>
  );
}
