import { Link } from "wouter";

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
            <p className="ml-4 text-neutral-600 hidden sm:block">
              Marathon Supporter Tracker
            </p>
          </div>
          <div className="text-xs sm:text-sm text-neutral-500">
            April 14, 2025
          </div>
        </div>
      </div>
    </header>
  );
}
