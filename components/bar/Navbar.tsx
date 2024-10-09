"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Label } from "../ui/label";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ConnectButtonWallet } from "../wallet/connect-button-wallet";

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

  return (
    <div
      className="absolute z-40 h-fit w-full py-5 md:py-0"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <div className="block md:hidden">
        <nav className="flex items-center justify-between px-5">
          <Logo />
          <div className="flex flex-row gap-x-4">
            {items.map((item, index) => (
              <Link key={index} href={item.link} className="cursor-pointer">
                <Label 
                  className={`font-semibold cursor-pointer ${
                    pathname === item.link ? 'text-textSecondary border-b-2 border-textSecondary border-dashed' : ''
                  }`}
                >
                  {item.label}
                </Label>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}

function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <div
      className="absolute z-40 h-fit w-full"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <div className="hidden md:block">
        <nav className="grid grid-cols-3 items-center gap-x-4 p-5">
          <Logo />
          <div className="flex flex-row justify-center gap-x-4">
            {items.map((item, index) => (
              <Link key={index} href={item.link} className="cursor-pointer">
                <Label 
                  className={`font-semibold cursor-pointer text-md ${
                    pathname === item.link ? 'text-textSecondary border-b-2 border-textSecondary border-dashed' : ''
                  }`}
                >
                  {item.label}
                </Label>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2">
            <ConnectButtonWallet/>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}