"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import {
  PublicAxiosInstance,
  USER_TOKEN,
  UserAxiosInstance,
} from "@/utils/Instance";

export const AuthOTPModal = ({
  email,
  account_id,
}: {
  email: string;
  account_id: boolean;
}) => {
  const router = useRouter();
  const [loading, set_loading] = useState<boolean>(false);
  const [open, set_open] = useState<boolean>(true);
  const [secret, set_secret] = useState<string>("");
  const [success, set_success] = useState<boolean>(false);
  const handleSubmit = async () => {
    set_loading(true);
    try {
      const response = await UserAxiosInstance.post(`/users/verify-otp`, {
        email,
        otp: Number(secret),
      });

      set_success(true);
      setTimeout(() => {
        localStorage.setItem(USER_TOKEN, response.data.token);

        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Invalid OTP");
      console.log(error);
    } finally {
      set_loading(false);
    }
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={set_open}>
        <AlertDialogContent className="flex flex-col gap-4">
          <AlertDialogHeader className="flex justify-center items-center">
            <AlertDialogTitle className="text-2xl font-bold">
              {!success && "Enter your OTP"}
            </AlertDialogTitle>

            {!success && (
              <AlertDialogDescription className="text-light-100 line-clamp-1 overflow-hidden">
                We've sent a code to&nbsp;
                <span className="text-primary font-semibold">{email} !</span>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <div className="w-11/12 mx-auto ">
            {success ? (
              <div className="flex items-center flex-col justify-center gap-2">
                <Spinner />
                <h1 className="text-sm">Signing in...</h1>
              </div>
            ) : (
              <InputOTP
                maxLength={6}
                className="flex w-full justify-between gap-5"
                value={secret}
                onChange={set_secret}
              >
                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={0}
                />

                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={1}
                />

                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={2}
                />

                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={3}
                />

                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={4}
                />

                <InputOTPSlot
                  className="w-full justify-center border-light-300 border rounded-md "
                  index={5}
                />
              </InputOTP>
            )}
          </div>

          <AlertDialogFooter>
            {!success && (
              <div className="flex w-full flex-col gap-4">
                <Button
                  onClick={handleSubmit}
                  className=" w-11/12 mx-auto"
                  type="button"
                  disabled={loading}
                >
                  Submit
                  <Spinner color={"secondary"} show={loading} />
                </Button>
                <div className="text-center text-sm">
                  Didn&apos;t get a code?{" "}
                  <Button
                    variant={"link"}
                    className="pl-1"
                    onClick={async () => {
                      try {
                        set_loading(true);
                        const response = await PublicAxiosInstance.post(
                          "/users/sign-in",
                          {
                            email,
                          }
                        );
                        toast.success("OTP sent successfully");
                      } catch (error) {
                        console.log(error);
                        toast.error("Failed to send OTP");
                      } finally {
                        set_loading(false);
                      }
                    }}
                  >
                    Click to Resend
                  </Button>
                </div>
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
