import React from "react";
import { Link } from "react-router-dom";
import {
  Puzzle,
  Lock,
  Shield,
  Eye,
  Users,
  Trophy,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Disc,
  HelpCircle,
  FileText,
  Truck,
  CreditCard,
  Star,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Puzzle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Puzzle
              </span>
            </Link>
            <p className="text-gray-400">
              Exclusive limited-edition collections. Each piece is part of a
              larger mystery. Own a fragment, solve the puzzle.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-puzzle"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-puzzle"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-500 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-puzzle"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-puzzle"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-black rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-puzzle"
                aria-label="Discord"
              >
                <Disc className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Puzzle Collections */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-primary-500" />
              Active Collections
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/collections/anime"
                  className="text-gray-400 hover:text-primary-400 transition-colors group flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Anime Chronicles</span>
                  <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full">
                    Active
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/mythology"
                  className="text-gray-400 hover:text-primary-400 transition-colors group flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Mythology Enigmas</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                    Soon
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/scifi"
                  className="text-gray-400 hover:text-primary-400 transition-colors group flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Sci-Fi Paradoxes</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                    Soon
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/archive"
                  className="text-gray-400 hover:text-primary-400 transition-colors group flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Solved Puzzles Archive</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming"
                  className="text-gray-400 hover:text-primary-400 transition-colors group flex items-center gap-2"
                >
                  <Star className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Upcoming Mysteries</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Puzzle Community */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary-500" />
              Puzzle Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/community"
                  className="text-gray-400 hover:text-secondary-400 transition-colors group flex items-center gap-2"
                >
                  <Users className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Owner's Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-gray-400 hover:text-secondary-400 transition-colors group flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Puzzle Leaderboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collaborate"
                  className="text-gray-400 hover:text-secondary-400 transition-colors group flex items-center gap-2"
                >
                  <Puzzle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Join a Puzzle Team</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  className="text-gray-400 hover:text-secondary-400 transition-colors group flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Solution Stories</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="text-gray-400 hover:text-secondary-400 transition-colors group flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Become a Puzzle Creator</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent-500" />
              Support
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-accent-400 transition-colors"
                >
                  How Puzzles Work
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-accent-400 transition-colors"
                >
                  Puzzle FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/authentication"
                  className="text-gray-400 hover:text-accent-400 transition-colors"
                >
                  Product Authentication
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-accent-400 transition-colors"
                >
                  Puzzle Terms
                </Link>
              </li>
            </ul>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Secret HQ • Location Classified</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>clues@puzzle-fashion.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>Contact via Owner's Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-800">
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-puzzle group">
            <div className="p-3 bg-primary-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-8 h-8 text-primary-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">One-of-a-Kind</p>
              <p className="text-sm text-gray-400">
                Each piece is globally unique
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-secondary-500 transition-all duration-300 hover:shadow-puzzle group">
            <div className="p-3 bg-secondary-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-secondary-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">NFT Authenticated</p>
              <p className="text-sm text-gray-400">
                Digital certificate of ownership
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-accent-500 transition-all duration-300 hover:shadow-puzzle group">
            <div className="p-3 bg-accent-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-8 h-8 text-accent-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">Puzzle Rewards</p>
              <p className="text-sm text-gray-400">
                Solve puzzles, win exclusive prizes
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Puzzle Hunt</h3>
            <p className="text-gray-400 mb-6">
              Get early access to new collections, puzzle clues, and exclusive
              community events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email for clues..."
                className="flex-grow px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <button className="btn-primary whitespace-nowrap px-6 py-3">
                Join the Hunt
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              By subscribing, you agree to our{" "}
              <Link
                to="/privacy"
                className="text-primary-400 hover:text-primary-300"
              >
                Privacy Policy
              </Link>{" "}
              and accept that you may receive puzzle clues.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} Puzzle Fashion. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Each piece tells a story. Every collection holds a secret.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Enigma
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Mystery
              </Link>
              <Link
                to="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie Clues
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-white transition-colors"
              >
                Site Map
              </Link>
              <Link
                to="/accessibility"
                className="hover:text-white transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Warning: Purchasing Puzzle products may lead to collaborative
              problem-solving, unexpected friendships, and the occasional
              treasure hunt.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
