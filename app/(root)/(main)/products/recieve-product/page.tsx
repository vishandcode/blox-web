"use client";
import { Button } from "@/components/ui/button";
import { UserAxiosInstance } from "@/utils/Instance";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "@/contexts/UserContext";

// Zod schema for validation
const ValidationSchema = z.object({
  product_id: z.string().min(24).max(24),
  sender_id: z.string().min(24).max(24),
  reciever_id: z.string().min(24).max(24),
  authorized_seller: z.boolean(),
  authorized_seller_name: z.string(),
  authorized_seller_email: z.string(),
  uid: z.string(),
  product_object: z.object({}),
});

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const [Data, SetData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver<any>(ValidationSchema),
    defaultValues: {
      product_id: params.get("id") || "",
      sender_id: "",
      reciever_id: "",
      authorized_seller: false,
      authorized_seller_name: "",
      authorized_seller_email: "",
      uid: "",
      product_object: {
        name: "",
        upc_id: "",
        _id: "",
      },
    },
  });
  const { StoreData } = useContext(UserContext);

  const RecieveData = () => {
    if (StoreData) {
      try {
        setValue("reciever_id", StoreData?._id || "");
      } catch (error) {
        console.error("Error setting form values:", error);
      }
    } else {
      console.warn("StoreData is undefined or null");
    }
  };

  useEffect(() => {
    RecieveData();
  }, [StoreData]);

  const FetchData = async (prod: string) => {
    try {
      setFetching(true);
      // const id = params.get("id");
      // if (!id) {
      //   router.push("/products");
      //   return;
      // }

      const response = await UserAxiosInstance.get(
        `/products/one-product?id=${prod}`
      );

      const product = response.data.payload.product;

      if (product) {
        // setValue("product_id", product?._id.toString());
        setValue("product_id", product._id.toString());
        setValue("sender_id", product.uid?._id.toString());

        setValue("product_object", product);
      }
    } catch (error) {
      console.log("Error fetching product:", error);
      toast.error("Failed to fetch product details.");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      if (watch("product_object")?._id === watch("reciever_id")) {
        toast.error("Could not transfer your product ! ");
        return;
      }
      await UserAxiosInstance.post(`/transactions/init-transaction`, {
        product_id: data.product_id,
        sender_id: data.sender_id,
        reciever_id: data.reciever_id,
        is_inverse: true,
      });

      router.push("/transactions/?status=all");
      toast.success("Product Transfered successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4  p-4 rounded-md">
          {/* <h1 className="font-bold text-lg">Transfer Product</h1> */}
          {/* <div className=" rounded-md  space-y-3">
              <h1 className="font-bold">Product Details</h1>
              <div className="flex justify-center"></div>
              <div>
                <h1 className="font-semibold text-sm">Name</h1>
                <h1 className="text-sm">{Data?.name}</h1>
              </div>
              <div>
                <h1 className="font-semibold text-sm">UPC ID</h1>
                <h1 className="text-sm">{Data?.upc_id}</h1>
              </div>
              <div>
                <h1 className="font-semibold text-sm">Description</h1>
                <h1 className="text-sm text-justify">{Data?.description}</h1>
              </div>
            </div> */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="product_id">Product ID </Label>
              <Input
                type={"search "}
                id="product_id"
                onChange={async (e: any) => {
                  if (e.target.value?.length === 24) {
                    FetchData(e.target.value);
                  }
                }}
              />
              <p className="text-destructive text-sm">
                {!errors?.product_id?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="sender_id">Sender ID (You)</Label>
              <Input
                id="sender_id"
                disabled
                {...register("sender_id")}
                placeholder="Enter your sender ID"
              />

              <p className="text-destructive text-sm">
                {!errors.sender_id?.message}
              </p>
            </div>
            <div>
              <Label htmlFor="reciever_id">Reciever ID </Label>
              <Input
                type="search"
                disabled
                id="reciever_id"
                value={watch("reciever_id") || ""}
                placeholder="Enter Reciever ID"
                onChange={async (e: any) => {
                  setValue("reciever_id", e.target.value);
                  if (e.target.value?.length === 24) {
                    if (e.target.value === StoreData?._id) {
                      toast.error("You cannot transfer to yourself !");
                      setValue("reciever_id", "");
                      return;
                    }
                    try {
                      toast.loading("Fetching User Details");
                      const response = await UserAxiosInstance.get(
                        "/users/get-another-user-details?id=" +
                          `${e.target.value}`
                      );
                      // if (response?.data?.payload._id === e.target.value) {
                      //   toast.error("You cannot transfer to yourself!");
                      //   setValue("reciever_id", "");
                      //   setValue("authorized_seller", false);
                      //   return;
                      // }
                      setValue("authorized_seller", true);
                      setValue(
                        "authorized_seller_name",
                        response?.data.payload.name
                      );
                      setValue(
                        "authorized_seller_email",
                        response?.data.payload.email
                      );
                    } catch (error: any) {
                      setValue("reciever_id", "");
                      setValue("authorized_seller", false);

                      toast.error(error.response.data.message);
                    } finally {
                      toast.dismiss();
                    }
                  }
                }}
              />
              {watch("authorized_seller") && (
                <>
                  <p className="text-xs p-1  font-bold">
                    User Name:{" "}
                    <span className="text-lime-700">
                      {watch("authorized_seller_name")}
                    </span>
                  </p>
                  <p className="text-xs p-1  font-bold">
                    User Email:{" "}
                    <span className="text-lime-700">
                      {watch("authorized_seller_email")}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant={"link"}
                size={"sm"}
                onClick={() => {
                  setValue("authorized_seller", false);
                  setValue("reciever_id", "");
                  setValue("product_id", "");
                  setValue("product_object", {
                    _id: "",
                    name: "",
                    upc_id: "",
                  });
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                size={"sm"}
                type="submit"
                disabled={
                  loading || watch("product_object")?._id ? false : true
                }
              >
                <Spinner color="secondary" show={loading} />
                {loading ? "On Progress..." : "Submit Request"}
              </Button>
            </div>

            {watch("product_object")?._id && (
              <div className="bg-accent p-3 rounded-md my-4 space-y-2">
                <h1 className="font-bold">Product Details</h1>
                <div className="flex justify-center"></div>
                <div>
                  <h1 className="text-neutral-600 text-sm">Product ID</h1>
                  <h1 className="text-sm">{watch("product_object")?._id}</h1>
                </div>
                <div>
                  <h1 className="text-neutral-600 text-sm">Name</h1>
                  <h1 className="text-sm">{watch("product_object")?.name}</h1>
                </div>
                <div>
                  <h1 className="text-neutral-600 text-sm">UPC ID</h1>
                  <h1 className="text-sm">{watch("product_object")?.upc_id}</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
