import {
  FORMAT_DATE_TO_STRING_F2,
  FORMAT_DATE_TO_STRING_F3,
} from "@/utils/General_Functions";
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { UserContext } from "@/contexts/UserContext";
import { toast } from "sonner";
import { UserAxiosInstance } from "@/utils/Instance";
export default function TransactionStepper({
  items,
  FetchData,
}: {
  items: any;
  FetchData?: any;
}) {
  const { StoreData } = useContext(UserContext);

  const Decide = async (status: string, transaction_id: string) => {
    try {
      toast.loading("Updating...");
      await UserAxiosInstance.patch(
        "/transactions/update-transaction?id=" + transaction_id,
        {
          status: status,
        }
      );
      FetchData();
      toast.success("Updated Successfully!");
    } catch (error) {
    } finally {
      toast.dismiss();
    }
  };
  return (
    <div>
      <Card className="rounded-md border-none shadow-none">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col items-start gap-8">
            <div className="absolute inset-4 flex items-center">
              <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
            </div>
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className={`relative flex items-start gap-4 ${
                  true
                    ? "text-primary dark:text-primary"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-950">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      (item?.status === "accepted" && "bg-lime-500") ||
                      (item?.status === "rejected" && "bg-destructive") ||
                      (item?.status === "pending" && "bg-blue-400") ||
                      (item?.status === "cancelled" && "bg-destructive")
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {FORMAT_DATE_TO_STRING_F2(item?.createdAt)}
                  </div>
                  <div className="text-base font-semibold flex flex-col gap-4">
                    <div>
                      <h1>Transaction Details</h1>
                      <div>
                        <h1 className="text-sm text-neutral-500">Status</h1>
                        <p className="text-xs font-bold">
                          {item?.status
                            ? item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h1>Product Details</h1>
                      <div>
                        <h1 className="text-sm text-neutral-500">Name</h1>
                        <p className="text-xs font-bold">
                          {item?.product_id?.name}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-sm text-neutral-500">UPC ID</h1>
                        <p className="text-xs font-bold">
                          {item?.product_id?.upc_id}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h1>Sender Details</h1>
                      <div>
                        <h1 className="text-sm text-neutral-500">
                          Sender Name
                        </h1>
                        <p className="text-xs font-bold">
                          {item?.sender_id?.name}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-sm text-neutral-500">
                          Sender Email
                        </h1>
                        <p className="text-xs font-bold">
                          {item?.sender_id?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h1>Reciever Details</h1>
                      <div>
                        <h1 className="text-sm text-neutral-500">
                          Reciever Name
                        </h1>
                        <p className="text-xs font-bold">
                          {item?.reciever_id?.name}
                        </p>
                      </div>
                      <div>
                        <h1 className="text-sm text-neutral-500">
                          Reciever Email
                        </h1>
                        <p className="text-xs font-bold">
                          {item?.reciever_id?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      {StoreData?._id === item?.reciever_id?._id &&
                        item?.is_inverse === false &&
                        item?.status === "pending" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              onClick={() => {
                                Decide("rejected", item?._id);
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              size={"sm"}
                              onClick={() => {
                                Decide("accepted", item?._id);
                              }}
                            >
                              Accept{" "}
                            </Button>
                          </div>
                        )}
                      {StoreData?._id === item?.reciever_id?._id &&
                        item?.is_inverse === true &&
                        item?.status === "pending" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              onClick={() => {
                                Decide("cancelled", item?._id);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      {StoreData?._id === item?.reciever_id?._id &&
                        item?.is_inverse === true &&
                        item?.status === "cancelled" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              onClick={() => {
                                Decide("pending", item?._id);
                              }}
                            >
                              Resend
                            </Button>
                          </div>
                        )}
                      {StoreData?._id === item?.sender_id?._id &&
                        item?.is_inverse === false &&
                        item?.status === "pending" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              onClick={() => {
                                Decide("cancelled", item?._id);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      {StoreData?._id === item?.sender_id?._id &&
                        item?.is_inverse === false &&
                        item?.status === "cancelled" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              onClick={() => {
                                Decide("pending", item?._id);
                              }}
                            >
                              Resend
                            </Button>
                          </div>
                        )}

                      {StoreData?._id === item?.sender_id?._id &&
                        item?.is_inverse === true &&
                        item?.status === "pending" && (
                          <div className="flex items-center gap-3">
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              onClick={() => {
                                Decide("rejected", item?._id);
                              }}
                            >
                              Reject
                            </Button>
                            <Button
                              size={"sm"}
                              onClick={() => {
                                Decide("accepted", item?._id);
                              }}
                            >
                              Accept{" "}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
