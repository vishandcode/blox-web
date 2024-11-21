import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { Routes } from "@/lib/routes";

export default function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex items-center justify-center">
      <FloatingDock desktopClassName="bg-background" mobileClassName="" items={Routes} />
    </div>
  );
}
