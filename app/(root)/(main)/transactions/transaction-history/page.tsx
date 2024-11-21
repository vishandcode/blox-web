"use client";
import TransactionStepper from "@/components/transaction-vertical-stepper";
import { UserAxiosInstance } from "@/utils/Instance";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const params = useSearchParams();

  const router = useRouter();
  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      router.push("/transactions");
    }
    return;
  }, []);

  const [Data, SetData] = useState<any>([]);
  const [loading, set_loading] = useState<boolean>(false);
  const FetchData = async () => {
    try {
      set_loading(true);
      const response = await UserAxiosInstance.get(
        "/transactions/product-transaction" + `?id=${params.get("id")}`
      );
      console.log(response.data);
      SetData(response.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    FetchData();
    return;
  }, [params]);
  return (
    <div>
      <div>
        <h1></h1>
      </div>
      <div>
        <TransactionStepper items={Data} FetchData={FetchData}/>
      </div>
    </div>
  );
}
