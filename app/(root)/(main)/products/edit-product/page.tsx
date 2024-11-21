"use client";
import { Button } from "@/components/ui/button";
import { UserAxiosInstance } from "@/utils/Instance";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

// Zod schema for validation
const ValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  upc_id: z.string().min(1, "UPC ID is required"),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof ValidationSchema>;

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

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
      if (product) {
        setValue("name", product.name);
        setValue("upc_id", product.upc_id);
        setValue("description", product.description);
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

  const onSubmit = async (data: ProductForm) => {
    try {
      setLoading(true);
      const id = params.get("id");
      if (!id) {
        toast.error("Product ID is missing.");
        return;
      }
      await UserAxiosInstance.patch(`/products/update-product?id=${id}`, data);
      toast.success("Product details updated successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
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
            <h1 className="font-bold text-lg">Edit Product Details</h1>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                <p className="text-destructive text-sm">
                  {errors.name?.message}
                </p>
              </div>

              <div>
                <Label htmlFor="upc_id">UPC ID</Label>
                <Input id="upc_id" {...register("upc_id")} />
                <p className="text-destructive text-sm">
                  {errors.upc_id?.message}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  {...register("description")}
                ></Textarea>
                <p className="text-destructive text-sm">
                  {errors.description?.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Spinner color="secondary" show={loading} />
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
