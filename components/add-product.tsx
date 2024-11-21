"use client";
import React, { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserAxiosInstance } from "@/utils/Instance";
import { MdAddToPhotos } from "react-icons/md";
import { Textarea } from "./ui/textarea";

export default function AddProductDialog({
  set_data,
  setPage,
  updateSearchParams,
  fetchProducts,
}: {
  set_data: any;
  setPage: any;
  updateSearchParams: any;
  fetchProducts: any;
}) {
  const [open, set_open] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const path = usePathname();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Name must be at least 2 characters.",
      })
      .max(50)
      .trim(),
    upc_id: z
      .string()
      .min(2, {
        message: "UPC Id must be at least 2 characters.",
      })
      .max(50)
      .trim(),
    description: z
      .string()
      .min(2, {
        message: "UPC Id must be at least 2 characters.",
      })
      .max(200)
      .trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      upc_id: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log(values);
      const response = await UserAxiosInstance.post("/products/add-product", {
        name: values.name,
        description: values.description,
        upc_id: values.upc_id,
      });

      toast.success(" Added Successfully !");
      form.reset();
      setPage(1);
      updateSearchParams();
      set_open(false);
      set_data([]);
      fetchProducts();
    } catch (error: any) {
      form.setError("upc_id", {
        type: "custom",
        message: "UPC id Already Exists",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size={"sm"} onClick={() => set_open(true)}>
        <span className="lg:block hidden">Add Product</span>
        <span className="">
          <MdAddToPhotos />
        </span>
      </Button>
      <Drawer open={open} onOpenChange={set_open}>
        <DrawerContent className="lg:w-4/12 mx-auto w-11/12">
          <DrawerHeader>
            <DrawerTitle>Add Product</DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-11/12 space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upc_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPC ID</FormLabel>
                    <FormControl>
                      <Input placeholder="UPC ID " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write here... "
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add"}
                <Spinner color={"secondary"} show={loading} />
              </Button>
            </form>
          </Form>

          <DrawerFooter>
            <DrawerClose />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
