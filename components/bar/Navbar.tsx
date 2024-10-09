"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Label } from "../ui/label";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ConnectButtonWallet } from "../wallet/connect-button-wallet";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const items = [
  { label: "Home", link: "/" },
  { label: "Donation", link: "/donation" },
  { label: "Proof", link: "/proof" },
];

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

function MobileNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute z-40 h-fit w-full py-5 md:hidden"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <nav className="flex items-center justify-between px-5">
        <Logo />
        <div className="flex flex-row items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="px-3 bg-background py-1.5 rounded-md shadow whitespace-nowrap transition-colors">
                <Menu className="h-[20px] w-[20px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="mt-8 flex flex-col gap-4">
                {items.map((item, index) => (
                  <Link key={index} href={item.link} onClick={() => setIsOpen(false)}>
                    <Label
                      className={`block w-full p-2 text-lg font-semibold cursor-pointer ${pathname === item.link ? 'text-textSecondary border-l-2 border-textSecondary pl-4' : ''
                        }`}
                    >
                      {item.label}
                    </Label>
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-start justify-center space-y-4">
                      <div onClick={() => setIsOpen(false)}>
                        <ConnectButtonWallet />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <div
      className="absolute z-40 hidden h-fit w-full md:block"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <nav className="grid grid-cols-3 items-center gap-x-4 p-5">
        <Logo />
        <div className="flex flex-row justify-center gap-x-4">
          {items.map((item, index) => (
            <Link key={index} href={item.link} className="cursor-pointer">
              <Label
                className={`font-semibold cursor-pointer text-md ${pathname === item.link ? 'text-textSecondary border-b-2 border-textSecondary border-dashed' : ''
                  }`}
              >
                {item.label}
              </Label>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <ConnectButtonWallet />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}