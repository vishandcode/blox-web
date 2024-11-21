"use client";
import { PublicAxiosInstance } from "@/utils/Instance";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { MdCopyAll, MdOutlineShare } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { toast } from "sonner";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  FORMAT_DATE_TO_STRING_F2,
  FORMAT_DATE_TO_STRING_F3,
} from "@/utils/General_Functions";
import Link from "next/link";
import TransactionStepper from "@/components/transaction-vertical-stepper";
export default function Page() {
  const params = useSearchParams();

  const router = useRouter();
  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      router.push("/");
    }
    return;
  }, []);

  const [Data, SetData] = useState<any>([]);
  const FetchData = async () => {
    try {
      const response = await PublicAxiosInstance.get(
        "/products/global-search-product" + `?id=${params.get("id")}`
      );
      console.log(response.data);
      SetData(response.data.payload);
    } catch (error) {
      console.log(error);
      toast.error("Product Not Found!");
      router.push("/");
    }
  };

  useEffect(() => {
    FetchData();
    return;
  }, [params]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href={"/"} className="font-bold my-2">
          BLOX
        </Link>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
      <div className="lg:w-11/12 mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-accent p-3 rounded-md  space-y-2">
            <h1 className="font-bold">Product Details</h1>
            <div>
              <h1 className="text-neutral-600 text-sm">Name</h1>
              <h1 className="text-sm">{Data?.product?.name}</h1>
            </div>
            <div>
              <h1 className="text-neutral-600 text-sm">UPC ID</h1>
              <h1 className="text-sm">{Data?.product?.upc_id}</h1>
            </div>
            <div>
              <h1 className="text-neutral-600 text-sm">Description</h1>
              <h1 className="text-sm text-justify">
                {Data?.product?.description}
              </h1>
            </div>

            <div>
              <h1 className="text-neutral-600 text-sm">Entered Blox At</h1>
              <h1 className="text-sm text-justify">
                {FORMAT_DATE_TO_STRING_F2(Data?.product?.createdAt)}
              </h1>
            </div>
            <div>
              <h1 className="text-neutral-600 text-sm">
                Ownership of the product
              </h1>
              <h1 className="text-sm text-justify">
                {Data?.product?.uid?.name}
              </h1>
            </div>
            <div>
              <h1 className="text-neutral-600 text-sm">Owner's Email</h1>
              <h1 className="text-sm text-justify">
                {Data?.product?.uid?.email}
              </h1>
            </div>
          </div>
        </div>
        <div>
          <TransactionStepper items={Data?.transactions || []} />
        </div>
      </div>
    </div>
  );
}
