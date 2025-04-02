import { Link } from "wouter";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaStrava, 
  FaApple, 
  FaGooglePlay 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rotterdam '25</h3>
            <p className="text-neutral-300 text-sm">
              The official supporter guide for the Rotterdam Marathon 2025. Help your runner achieve their best by being at the right place at the right time.
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
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <FaStrava className="text-xl" />
              </a>
            </div>
            <p className="text-neutral-300 text-sm">Download our mobile app:</p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-xs bg-neutral-800 hover:bg-neutral-700 py-2 px-3 rounded transition-colors">
                <FaApple className="inline mr-1" /> App Store
              </a>
              <a href="#" className="text-xs bg-neutral-800 hover:bg-neutral-700 py-2 px-3 rounded transition-colors">
                <FaGooglePlay className="inline mr-1" /> Play Store
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; 2025 Rotterdam Marathon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
