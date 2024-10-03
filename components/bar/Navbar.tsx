"use client";

import Link from "next/link";
import { Label } from "../ui/label";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { label: "Home", link: "/" },
  { label: "Donation", link: "/donation" },
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
  return (
    <div
      className="absolute z-40 h-fit w-full py-5 md:py-0"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <div className="block md:hidden" >
        <nav className="container flex items-center justify-between px-5">
          <Logo />
          <div className="flex flex-row gap-x-4">
            {items.map((item, index) => (
              <Link key={index} href={item.link} className="cursor-pointer">
                <Label className="font-semibold cursor-pointer">{item.label}</Label>
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
  return (
    <div
      className="absolute z-40 h-fit w-full"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <div className="hidden md:block" >
        <nav className="container flex items-center justify-between gap-x-4 p-5">
          <Logo />
          <div className="flex flex-row gap-x-4">
            {items.map((item, index) => (
              <Link key={index} href={item.link} className="cursor-pointer">
                <Label className="font-semibold cursor-pointer">{item.label}</Label>
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