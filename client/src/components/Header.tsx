import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-primary font-bold text-2xl cursor-pointer">Rotterdam '25</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex space-x-6">
              <Link href="/">
                <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Home</span>
              </Link>
              <Link href="/">
                <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Runners</span>
              </Link>
              <Link href="/">
                <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Guide</span>
              </Link>
              <Link href="/">
                <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Contact</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex">
            <Button className="bg-primary text-white hover:bg-opacity-90">
              Start Tracking
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Home</span>
                  </Link>
                  <Link href="/">
                    <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Runners</span>
                  </Link>
                  <Link href="/">
                    <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Guide</span>
                  </Link>
                  <Link href="/">
                    <span className="text-neutral-700 hover:text-primary font-medium cursor-pointer">Contact</span>
                  </Link>
                  <Button className="bg-primary text-white hover:bg-opacity-90 mt-4">
                    Start Tracking
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
