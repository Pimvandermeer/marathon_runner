import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rotterdam '25</h3>
            <p className="text-neutral-300 text-sm">
              A supporter tool for the Rotterdam Marathon 2025. Track runners and plan where to support them throughout the race.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <span className="text-neutral-300 hover:text-white transition-colors cursor-pointer">Marathon Homepage</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-neutral-300 hover:text-white transition-colors cursor-pointer">Runner Registration</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-neutral-300 hover:text-white transition-colors cursor-pointer">Course Map</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-neutral-300 hover:text-white transition-colors cursor-pointer">Event Schedule</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; 2025 Rotterdam Supporter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
