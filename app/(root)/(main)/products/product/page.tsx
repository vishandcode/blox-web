"use client";
import { UserAxiosInstance } from "@/utils/Instance";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { MdCopyAll, MdOutlineShare } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FaLink } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";
export default function Page() {
  const params = useSearchParams();

  const router = useRouter();
  useEffect(() => {
    const id = params.get("id");
    if (!id) {
      router.push("/products");
    }
    return;
  }, []);

  const [Data, SetData] = useState<any>([]);
  const [loading, set_loading] = useState<boolean>(false);
  const FetchData = async () => {
    try {
      set_loading(true);
      const response = await UserAxiosInstance.get(
        "/products/one-product" + `?id=${params.get("id")}`
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
  const qrRef = useRef<any>(null);

  const downloadQr = async () => {
    if (qrRef.current === null) return;

    const canvas = await html2canvas(qrRef.current);
    const qrImage = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = Data?.product?._id + "qr-code.png" || "";
    link.click();
  };
  const Share_Link = process.env.NEXT_PUBLIC_WEB_URL + "/search?id=";
  return (
    <div>
      <div className="">
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[20dvh] w-1/2" />
              <Skeleton className="h-[20dvh]" />
            </div>
            <Skeleton className="h-[50dvh]" />
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-12 grid-cols-2 gap-4">
              <div
                className="bg-accent p-2  lg:col-span-10 border rounded-md"
                ref={qrRef}
                style={{
                  maxWidth: 180,
                  width: "100%",
                }}
              >
                <QRCode
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  value={Share_Link + Data?.product?._id || ""}
                />
              </div>
              <div className="space-y-4 flex flex-col lg:col-span-2">
                <Button
                  className="flex justify-start"
                  size={"sm"}
                  onClick={downloadQr}
                >
                  <AiOutlineDownload /> Download QR
                </Button>
                <Button
                  className="flex justify-start"
                  size={"sm"}
                  onClick={async () => {
                    if ("clipboard" in navigator) {
                      await navigator.clipboard.writeText(
                        Share_Link + Data?.product?._id
                      );
                    } else {
                      document.execCommand(
                        "copy",
                        true,
                        Share_Link + Data?.product?._id
                      );
                    }
                    toast.success("Copied to clipboard");
                  }}
                >
                  <FaLink />
                  Copy Link
                </Button>
                <Button
                  className="flex justify-start"
                  size={"sm"}
                  onClick={() => {
                    router.push(
                      "/products/transfer-product?id=" + Data?.product?._id
                    );
                  }}
                >
                  <BiSolidSend />
                  Transfer
                </Button>
              </div>
            </div>
            <div className="bg-accent p-3 rounded-md my-4 space-y-2">
              <h1 className="font-bold">Product Details</h1>
              <div className="flex justify-center"></div>
              <div>
                <h1 className="text-neutral-600 text-sm">Product ID</h1>
                <h1 className="text-sm">{Data?.product?._id}</h1>
              </div>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
