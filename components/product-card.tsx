"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import React from "react";
import { MdDateRange, MdDelete, MdInfo, MdModeEdit } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { toast } from "sonner";
import { UserAxiosInstance } from "@/utils/Instance";
import { FORMAT_DATE_TO_STRING_F2 } from "@/utils/General_Functions";
import { FaBoxes } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";
export default function ProductCard({
  product,
  sender,
  receiver,
  set_data,
}: {
  product: any; // Product details
  sender?: any; // Sender details
  receiver?: any; // Receiver details
  set_data?: any; // Function to update product data
}) {
  const router = useRouter();
  const Share_Link = process.env.NEXT_PUBLIC_WEB_URL + "/search?id=";

  return (
    <div data-aos="zoom-in" className="select-none">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            data-aos="zoom-in"
            className="flex flex-col justify-center cursor-pointer"
            onClick={() => {
              router.push("/products/product" + `?id=${product?._id}`);
            }}
          >
            <div className="border rounded-md flex justify-between bg-accent space-y-4 p-3 ">
              <div className="space-y-1">
                <h1 className="font-bold">{product?.upc_id}</h1>
                <h1 className="truncate overflow-hidden text-xs">
                  {product?.name}
                </h1>
                <p className="truncate overflow-hidden text-xs flex items-center gap-1">
                  <MdDateRange /> {FORMAT_DATE_TO_STRING_F2(product?.createdAt)}
                </p>
              </div>
              <div className="flex justify-center">
                <FaBoxes className="opacity-20 text-5xl" />
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          {/* Share Link */}
          <ContextMenuItem
            className="gap-2"
            onClick={async () => {
              if ("clipboard" in navigator) {
                await navigator.clipboard.writeText(Share_Link + product?._id);
              } else {
                document.execCommand("copy", true, Share_Link + product?._id);
              }
              toast.success("Copied to clipboard");
            }}
          >
            <FaLink />
            <span className="text-xs">Copy link</span>
          </ContextMenuItem>

          {/* Edit Product */}
          <ContextMenuItem
            className="gap-2"
            onClick={() => {
              router.push("/products/edit-product?id=" + product?._id);
            }}
          >
            <MdModeEdit />
            <span className="text-xs">Edit</span>
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-2"
            onClick={() => {
              router.push("/products/transfer-product?id=" + product?._id);
            }}
          >
            <BiSolidSend />
            <span className="text-xs">Transfer</span>
          </ContextMenuItem>

          {/* Delete Product */}
          <ContextMenuItem
            className="hover:!bg-destructive gap-2"
            onClick={async () => {
              try {
                toast.loading("Deleting...");
                const response = await UserAxiosInstance.delete(
                  "/products/delete-product" + `?id=${product?._id}`
                );
                toast.success("Deleted Successfully!");
                set_data((prev: any) =>
                  prev?.filter((i: any) => i._id !== product?._id)
                );
              } catch (error: any) {
                toast.error(error.response.data.message);
              } finally {
                toast.dismiss();
              }
            }}
          >
            <MdDelete />
            <span className="text-xs">Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
