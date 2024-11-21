"use client";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <div
      className={
        "w-full h-dvh  relative overflow-hidden flex items-center justify-center"
      }
    >
      <div className="fixed top-0 right-0  p-3 z-50 flex gap-4">
        <Button
          onClick={() => {
            router.push("/sign-in");
          }}
          variant={"link"}
          size={"sm"}
        >
          Sign in
        </Button>
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
          size={"sm"}
        >
          Go to console
        </Button>
      </div>
      <div className="fixed top-0 left-0  p-3 z-50 flex gap-4">
        <ThemeSwitcher />
      </div>
      <div className={"text-xl font-bold flex flex-col w-11/12 mx-auto"}>
        <h1 className="text-center">BLOX</h1>
        <p className="text-sm text-center font-semibold text-neutral-400 text-destructive">
          Where Every Block Secures Your Product's Authenticity !
        </p>
      </div>
    </div>
  );
}
