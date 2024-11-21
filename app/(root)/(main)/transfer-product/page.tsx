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
});

type ProductForm = z.infer<typeof ValidationSchema>;

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const [Data, SetData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductForm>({
    resolver: zodResolver(ValidationSchema),
  });
  const { StoreData } = useContext(UserContext);
  const FetchData = async () => {
    try {
      setFetching(true);
      const id = params.get("id");
      if (!id) {
        router.push("/products");
        return;
      }
      const response = await UserAxiosInstance.get(
        `/products/one-product?id=${id}`
      );

      const product = response.data.payload.product;
      SetData(product);
      if (product) {
        setValue("product_id", product._id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    FetchData();
  }, [params]);

  useEffect(() => {
    setValue("reciever_id", "");
    setValue("sender_id", StoreData?._id);
  }, [StoreData]);

  const onSubmit = async (data: ProductForm) => {
    try {
      setLoading(true);
      const id = params.get("id");
      if (!id) {
        toast.error("Product ID is missing.");
        return;
      }
      await UserAxiosInstance.post(`/transactions/init-transaction`, {
        product_id: data.product_id,
        sender_id: data.sender_id,
        reciever_id: data.reciever_id,
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
      {fetching ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[50dvh]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 bg-accent p-4 rounded-md">
            <h1 className="font-bold text-lg">Transfer Product</h1>
            <div className="bg-accent rounded-md  space-y-3">
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
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="product_id">Product ID </Label>
                <Input id="product_id" disabled {...register("product_id")} />
                <p className="text-destructive text-sm">
                  {errors.product_id?.message}
                </p>
              </div>

              <div>
                <Label htmlFor="sender_id">Sender ID (You)</Label>
                <Input id="sender_id" disabled {...register("sender_id")} />

                <p className="text-destructive text-sm">
                  {errors.sender_id?.message}
                </p>
              </div>
              <div>
                <Label htmlFor="reciever_id">Reciever ID </Label>
                <span className="text-xs text-destructive">
                  *Can be found at account credentials
                </span>
                <Input
                  type="search"
                  disabled={watch("authorized_seller")}
                  id="reciever_id"
                  value={watch("reciever_id")}
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

                <p className="text-destructive text-sm">
                  {errors.reciever_id?.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant={"link"}
                size={"sm"}
                onClick={() => {
                  setValue("authorized_seller", false);
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                size={"sm"}
                type="submit"
                disabled={loading || watch("authorized_seller") ? false : true}
              >
                <Spinner color="secondary" show={loading} />
                {loading ? "On Progress..." : "Transfer"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
