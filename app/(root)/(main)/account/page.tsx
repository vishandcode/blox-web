"use client";
import { Button } from "@/components/ui/button";
import { USER_TOKEN, UserAxiosInstance } from "@/utils/Instance";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UserContext } from "@/contexts/UserContext";
import { Spinner } from "@/components/ui/spinner";

const ValidationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
});

type FormData = z.infer<typeof ValidationSchema>;

export default function Account() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(ValidationSchema),
  });

  const [Loading, SetLoading] = useState(false);
  const { StoreData, GetData } = React.useContext(UserContext);
  const router = useRouter();
  const RecieveData = () => {
    if (StoreData) {
      try {
        setValue("email", StoreData.email || "");
        setValue("name", StoreData.name || "");
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Profile </h1>
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={() => {
            toast.loading("Logging out...");
            localStorage.removeItem(USER_TOKEN);
            setTimeout(() => {
              toast.dismiss();
              router.push("/sign-in");
            }, 2000);
          }}
        >
          <MdLogout size={10} />
          Sign Out
        </Button>
      </div>
      <form
        className=""
        onSubmit={handleSubmit(async (data) => {
          try {
            SetLoading(true);
            const response = await UserAxiosInstance.patch(
              "/users/update-user",
              data
            );
            if (response?.data?.email_changed === true) {
              if (typeof localStorage !== "undefined") {
                localStorage.removeItem(USER_TOKEN);
              }
              router.push("/signin");
              return;
            }
            await GetData();
          } catch (error: any) {
            if (error.response.data.type === "key_error") {
              setError("email", {
                type: "custom",
                message: error?.response.data.message,
              });
              return;
            }
          } finally {
            SetLoading(false);
          }
        })}
      >
        <div className="lg:grid gap-4 lg:grid-cols-2 flex flex-col">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={watch("email") || ""}
              onChange={(e: any) => {
                setValue("email", e.target.value);
              }}
            />
            <p className="text-destructive text-xs">
              {errors?.email?.message ?? ""}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={watch("name") || ""}
              onChange={(e: any) => {
                setValue("name", e.target.value);
              }}
            />
            <p className="text-destructive text-xs">
              {errors?.name?.message ?? ""}
            </p>
          </div>

          <div className="col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={
                Loading ||
                (StoreData?.email === watch("email") &&
                  StoreData?.name === watch("name"))
              }
            >
              <Spinner color={"secondary"} show={Loading} />
              {Loading ? "Updating" : "Update"}
            </Button>
          </div>
        </div>
      </form>
      <hr className="my-4" />
      <div>
        <h1>Account Credentails</h1>
        <div>
          <h1 className="text-neutral-500">Account ID</h1>
          <h1>{StoreData?._id}</h1>
        </div>
      </div>
    </div>
  );
}
